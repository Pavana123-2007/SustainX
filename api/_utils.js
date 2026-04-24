import { neon } from "@neondatabase/serverless";
import admin from "firebase-admin";

export const DEV_MODE = process.env.NODE_ENV !== 'production';

let dbInstance = null;

export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  if (!dbInstance) {
    dbInstance = neon(process.env.DATABASE_URL);
  }
  return dbInstance;
}

export async function verifyUser(idToken, allowAnonymous = false) {
  let uid = allowAnonymous ? "anonymous" : "dev-user";
  
  if (!DEV_MODE && idToken) {
    if (!admin.apps.length) {
      try {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
          });
        } else {
          // If no credential provided, application default will be used internally by firebase-admin,
          // but we initialize without args
          admin.initializeApp();
        }
      } catch (error) {
        console.error("[Firebase Admin] Init error:", error.message);
      }
    }
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      uid = decodedToken.uid;
    } catch (error) {
      if (!allowAnonymous) {
        throw new Error("Invalid or expired authentication token");
      }
    }
  } else if (DEV_MODE && idToken) {
    try {
      const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      uid = payload.user_id || payload.sub || uid;
    } catch (e) {
      // Keep default uid
    }
  }
  
  return uid;
}
