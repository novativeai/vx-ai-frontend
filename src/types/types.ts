// This file is the single source of truth for all shared types in the application.

// Type for a single parameter within a model's configuration
export interface ModelParameter {
  name: string;
  label: string;
  type: 'textarea' | 'image' | 'slider' | 'dropdown';
  defaultValue: string | number | null;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

// Types for the "Guidelines" section content
export interface TipContent {
  subtitle: string;
  text: string;
  list?: string[];
}
export interface TipSection {
  title: string;
  content: TipContent[];
}

// The master type for a single model's entire configuration
export interface ModelConfig {
  id: string;
  displayName: string;
  outputType: 'video' | 'image';
  description: string;
  bannerImage: string;
  cardVideo: string;
  tags: string[];
  params: ModelParameter[];
  tips?: TipSection[];
  useCases?: TipSection[];
}

// The type for a single generation history item from Firestore
export interface Generation {
  id: string;
  outputUrl: string;
  outputType: 'video' | 'image';
  prompt: string;
  createdAt: {
    toDate: () => Date;
  };
  status?: 'completed' | 'pending' | 'failed';
  modelId?: string;
}

// The type for a single payment transaction from Firestore
export interface PaymentTransaction {
  id: string;
  createdAt: {
    toDate: () => Date;
  };
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  type?: string;
}