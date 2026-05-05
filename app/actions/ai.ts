"use server";

import { VertexAI } from "@google-cloud/vertexai";
import { Transaction } from "@/lib/types";

// Helper to initialize Vertex AI securely
function getVertexAI() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  let credentials;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const jsonStr = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8');
    credentials = JSON.parse(jsonStr);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  } else {
    throw new Error("Missing Vertex AI configuration on server");
  }

  return new VertexAI({
    project: projectId,
    location: "us-central1", // Standard region for Gemini
    googleAuthOptions: {
      credentials,
    },
  });
}

// Ensure the AI only returns the JSON format we expect
const responseSchema = {
  type: "object",
  properties: {
    optimizations: {
      type: "array",
      description: "Actionable suggestions to save money without drastically altering lifestyle.",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          potentialSavingsCents: { type: "integer", description: "Estimated monthly savings in cents" },
        },
        required: ["title", "description", "potentialSavingsCents"],
      },
    },
    anomalies: {
      type: "array",
      description: "Unusual or out-of-ordinary expenses or income spikes.",
      items: {
        type: "object",
        properties: {
          transactionId: { type: "string" },
          reason: { type: "string", description: "Why this was flagged as an anomaly" },
        },
        required: ["transactionId", "reason"],
      },
    },
    fixedVariableBreakdown: {
      type: "object",
      properties: {
        fixedTotalCents: { type: "integer", description: "Total cents spent on fixed/recurring expenses" },
        variableTotalCents: { type: "integer", description: "Total cents spent on variable/discretionary expenses" },
        reclassifications: {
          type: "array",
          description: "If a transaction seems miscategorized based on merchant, suggest a reclassification.",
          items: {
            type: "object",
            properties: {
              transactionId: { type: "string" },
              suggestedType: { type: "string", enum: ["Fixed", "Variable"] },
            },
            required: ["transactionId", "suggestedType"],
          },
        },
      },
      required: ["fixedTotalCents", "variableTotalCents", "reclassifications"],
    },
    detectedCurrency: {
      type: "string",
      description: "The 3-letter currency code (e.g., USD, EUR, TRY, GBP) detected from the transactions or context.",
    },
  },
  required: ["optimizations", "anomalies", "fixedVariableBreakdown", "detectedCurrency"],
};

export async function generateFinancialInsights(transactions: Transaction[]) {
  try {
    const vertexAI = getVertexAI();
    
    // We use gemini-1.5-flash as it is fast, highly capable of structured data, and cost-effective
    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Strip out unnecessary data to save tokens and minimize PII exposure
    const simplifiedTransactions = transactions.map((t) => ({
      id: t.id,
      amountCents: t.amount,
      date: t.date,
      category: t.categoryName,
      merchant: t.merchant,
      description: t.description,
    }));

    const prompt = `
      You are a strict, objective financial advisor analyzing a user's monthly transactions.
      Your goal is to provide clarity, identify optimization potentials, find anomalies, 
      and calculate fixed vs. variable spending.

      Rules:
      1. Fixed expenses are recurring, predictable necessities (e.g., Rent, Utilities, Subscriptions).
      2. Variable expenses fluctuate and are often discretionary (e.g., Dining Out, Shopping).
      3. All amounts provided are in CENTS (e.g., 1500 = $15.00). Keep potential savings in cents.
      4. Detect the main currency used in these transactions (USD, EUR, TRY, etc.). If unsure, default to USD.
      5. Be extremely concise. No fluff.

      Analyze these transactions:
      ${JSON.stringify(simplifiedTransactions, null, 2)}
    `;

    const request = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const response = await generativeModel.generateContent(request);
    const resultText = response.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error("No response from AI");
    }

    return JSON.parse(resultText);
  } catch (error) {
    console.error("AI Insights Error:", error);
    // In demo mode or if keys are missing, return a graceful fallback
    return {
      error: "Unable to generate insights at this time. Please check your backend connection.",
      demoFallback: true
    };
  }
}
