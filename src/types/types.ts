// This file holds shared type definitions used across your application.

export interface Generation {
  id: string;
  outputUrl: string;
  outputType: 'video' | 'image';
  prompt: string;
  createdAt: {
    toDate: () => Date;
  };
  status?: 'completed' | 'pending' | 'failed';
  amount?: number; // Added for transaction history consistency
  [key: string]: any; // Allow for other potential fields from Firestore
}

export interface PaymentTransaction {
  id: string;
  createdAt: {
    toDate: () => Date;
  };
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  [key: string]: any; // Allow for other fields like 'type' or 'invoiceUrl'
}