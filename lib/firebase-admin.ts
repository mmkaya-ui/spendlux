import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  let credentials;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const jsonStr = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('utf-8');
    credentials = JSON.parse(jsonStr);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  }

  if (credentials) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    console.warn("Firebase Admin: No credentials found, running in limited mode");
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
