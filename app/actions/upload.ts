"use server";

import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { db } from "@/lib/firebase-admin";
import { Transaction } from "@/lib/types";
import { cookies } from "next/headers";

// Helper to get DocAI Client
function getDocAIClient() {
  let credentials;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const jsonStr = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, "base64").toString("utf-8");
    credentials = JSON.parse(jsonStr);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  }

  if (!credentials) throw new Error("Missing Google Cloud credentials");

  const location = process.env.DOCUMENT_AI_LOCATION || "us";
  const apiEndpoint = `${location}-documentai.googleapis.com`;

  return new DocumentProcessorServiceClient({
    apiEndpoint,
    credentials,
  });
}

export async function processBankStatement(formData: FormData, userId: string) {
  try {
    if (!userId) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const buffer = Buffer.from(await file.arrayBuffer());
    const client = getDocAIClient();

    const name = `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/${process.env.DOCUMENT_AI_LOCATION}/processors/${process.env.DOCUMENT_AI_PROCESSOR_ID}`;

    const [result] = await client.processDocument({
      name,
      rawDocument: {
        content: buffer,
        mimeType: file.type,
      },
    });

    const document = result.document;
    if (!document) throw new Error("Parsing failed: No document content");

    const transactions: Transaction[] = [];

    // The Bank Statement Parser returns transactions as 'line_item' entities
    const entities = document.entities || [];
    
    entities.forEach((entity, index) => {
      if (entity.type === "line_item") {
        let amount = 0;
        let date = new Date().toISOString();
        let description = "Unknown Transaction";
        let merchant = "Unknown";

        entity.properties?.forEach(prop => {
          if (prop.type === "amount") {
             // Amount is usually a string like "123.45"
             const val = parseFloat(prop.mentionText?.replace(/[^0-9.-]+/g, "") || "0");
             amount = Math.round(val * 100); // Convert to cents
          }
          if (prop.type === "date") {
             date = prop.mentionText || date;
          }
          if (prop.type === "description") {
             description = prop.mentionText || description;
          }
        });

        transactions.push({
          id: `tx_${Date.now()}_${index}`,
          amount,
          date,
          description,
          merchant: description.split(" ")[0] || "Unknown", // Naive merchant extraction
          categoryId: "uncategorized",
          categoryName: "Uncategorized",
          type: amount < 0 ? "expense" : "income",
          source: "pdf_upload"
        });
      }
    });

    // Save to Firestore
    const batch = db.batch();
    transactions.forEach(tx => {
      const docRef = db.collection("users").doc(userId).collection("transactions").doc(tx.id);
      batch.set(docRef, {
        ...tx,
        createdAt: new Date().toISOString()
      });
    });
    
    await batch.commit();

    return { success: true, count: transactions.length };
  } catch (error: any) {
    console.error("Document AI Error:", error);
    return { success: false, error: error.message };
  }
}
