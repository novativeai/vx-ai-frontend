// This file is the single source of truth for all shared types in the application.
import { type FieldValue, type Timestamp } from "firebase/firestore";

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
  cardVideo?: string; // Video thumbnail for video models
  cardImage?: string; // Static image thumbnail for image models
  exampleVideo?: string; // Video shown as example on generator page
  exampleImage?: string; // Static image shown as example for image models
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

// Marketplace Product Type
export interface MarketplaceProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  videoUrl: string;
  generationId: string;
  prompt: string;
  price: number; // EUR
  tags: string[];
  hasAudio: boolean;
  useCases: string[];
  thumbnailUrl?: string;
  status: 'draft' | 'published' | 'delisted';
  createdAt?: Timestamp | FieldValue;   // <- updated
  updatedAt?: Timestamp | FieldValue;
  sold: number;
}

// Marketplace Purchase Order Type
export interface MarketplacePurchase {
  id: string;
  itemId: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  price: number;
  status: 'pending' | 'paid' | 'delivered';
  purchasedAt: {
    toDate: () => Date;
  };
  deliveryEmail: string;
  videoUrl: string;
  downloadCount: number;
  expiresAt: {
    toDate: () => Date;
  };
  rights: {
    commercialUse: boolean;
    redistribution: boolean;
    modification: boolean;
  };
}

// Seller Profile Type
export interface SellerProfile {
  shopName: string;
  shopDescription: string;
  isSeller: boolean;
  verified: boolean;
  totalSales: number;
  rating: number;
  totalEarnings: number;
}

// Student Verification Type
export interface StudentVerification {
  isAStudent: boolean;
  studentCardUrl?: string; // URL to uploaded student card image
  schoolName: string;
  schoolCountry: string;
  schoolEmail?: string;
  graduationYear?: number;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedAt?: {
    toDate: () => Date;
  };
  rejectionReason?: string;
}

// Last payment method stored from PayTrust webhook
export interface LastPaymentMethod {
  last4?: string;
  maskedPan?: string;
  cardBrand?: string;
  cardholderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  updatedAt?: Timestamp | FieldValue | Date;
}

// User Profile Type - represents all user data in Firestore
export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postCode?: string;
  country?: string;
  credits: number;
  activePlan: string;
  isAdmin: boolean;
  emailVerified: boolean;
  profileComplete: boolean;
  lastPaymentMethod?: LastPaymentMethod;
  createdAt: Timestamp | FieldValue | Date;
  updatedAt?: Timestamp | FieldValue | Date;
}