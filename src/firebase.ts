import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKjTX1oHTbD7mNqtpJdzLZuuE_pHE9yHE",
  authDomain: "overhaultrain-7c42e.firebaseapp.com",
  projectId: "overhaultrain-7c42e",
  storageBucket: "overhaultrain-7c42e.firebasestorage.app",
  messagingSenderId: "465709612039",
  appId: "1:465709612039:web:dc21b4bed803de6d1fbea2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Strict Error Handling Specifications from System Instruction guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error("Firestore Error payload logged for diagnostics:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
