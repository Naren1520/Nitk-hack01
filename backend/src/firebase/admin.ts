import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const serviceAccount = require('../config/serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = getFirestore();

export async function uploadCollectionData(
  collectionName: string,
  data: any[],
  batchSize: number = 500
) {
  const collectionRef = db.collection(collectionName);
  const batches = [];
  let currentBatch = db.batch();
  let operationCount = 0;

  for (const item of data) {
    const docRef = collectionRef.doc();
    currentBatch.set(docRef, item);
    operationCount++;

    if (operationCount === batchSize) {
      batches.push(currentBatch.commit());
      currentBatch = db.batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    batches.push(currentBatch.commit());
  }

  try {
    await Promise.all(batches);
    console.log(`Successfully uploaded ${data.length} documents to ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`Error uploading to ${collectionName}:`, error);
    throw error;
  }
}

export async function clearCollection(collectionName: string) {
  const collectionRef = db.collection(collectionName);
  
  try {
    const snapshot = await collectionRef.get();
    const batch = db.batch();
    
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Successfully cleared collection: ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`Error clearing collection ${collectionName}:`, error);
    throw error;
  }
}