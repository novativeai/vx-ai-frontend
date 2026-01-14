/**
 * Centralized API client for making authenticated requests to the backend.
 * Handles token management, error handling, and request/response processing.
 */

import { auth } from './firebase';
import { logger } from './logger';

// API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://aivideogenerator-production.up.railway.app';

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request options interface
 */
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  requireAuth?: boolean;
  timeout?: number;
}

/**
 * Gets the current user's Firebase ID token
 * Handles token refresh automatically
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth?.currentUser;
    if (!user) {
      return null;
    }

    // getIdToken automatically refreshes if the token is expired
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    logger.error('Failed to get auth token', error);
    return null;
  }
}

/**
 * Builds request headers with optional authentication
 */
async function buildHeaders(
  customHeaders?: HeadersInit,
  requireAuth: boolean = true
): Promise<Headers> {
  const headers = new Headers(customHeaders);

  // Set default content type if not present
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add authentication header if required
  if (requireAuth) {
    const token = await getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      logger.warn('Auth token not available for authenticated request');
    }
  }

  return headers;
}

/**
 * Makes an HTTP request with proper error handling and retries
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    body,
    requireAuth = true,
    timeout = 30000,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers = await buildHeaders(customHeaders, requireAuth);

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    logger.debug('API Request', { url, method: fetchOptions.method || 'GET' });

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle response
    if (!response.ok) {
      let errorDetail: string | undefined;
      try {
        const errorBody = await response.json();
        errorDetail = errorBody.detail || errorBody.message || JSON.stringify(errorBody);
      } catch {
        errorDetail = response.statusText;
      }

      logger.error('API Error', new Error(errorDetail), {
        statusCode: response.status,
        url,
      });

      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
        errorDetail
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      logger.error('Request timeout', error, { url, timeout });
      throw new ApiError('Request timed out', 408, 'The request took too long to complete');
    }

    logger.error('Network error', error, { url });
    throw new ApiError(
      'Network error',
      0,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

/**
 * API Client with typed methods for each endpoint
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  // --- Specific API endpoints ---

  /**
   * Generate video/image
   */
  generateMedia: async (params: {
    prompt: string;
    model?: string;
    uid: string;
    duration?: number;
    size?: string;
    imageUrl?: string;
  }) => {
    return apiClient.post<{
      id: string;
      status: string;
      output?: string | string[];
    }>('/generate-video', params);
  },

  /**
   * Check generation status
   */
  checkStatus: async (predictionId: string) => {
    return apiClient.get<{
      id: string;
      status: string;
      output?: string | string[];
      error?: string;
    }>(`/status/${predictionId}`);
  },

  /**
   * Create one-time payment
   */
  createPayment: async (userId: string, customAmount: number) => {
    return apiClient.post<{ paymentUrl: string }>('/create-payment', {
      userId,
      customAmount,
    });
  },

  /**
   * Create subscription
   */
  createSubscription: async (userId: string, priceId: string) => {
    return apiClient.post<{ paymentUrl: string }>('/create-subscription', {
      userId,
      priceId,
    });
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (paymentId: string, userId: string) => {
    return apiClient.get<{
      status: string;
      creditsPurchased?: number;
    }>(`/payment-status/${paymentId}?userId=${userId}`);
  },

  /**
   * Create customer portal session
   */
  createPortalSession: async (userId: string) => {
    return apiClient.post<{ portalUrl: string }>('/create-customer-portal-session', {
      userId,
    });
  },

  /**
   * Health check (no auth required)
   */
  healthCheck: async () => {
    return apiClient.get<{ status: string; timestamp: string }>('/health', {
      requireAuth: false,
    });
  },

  // --- Seller/Payout endpoints ---

  /**
   * Create payout request
   */
  createPayoutRequest: async (params: {
    amount: number;
    bankDetails: {
      iban: string;
      accountHolder: string;
      bankName?: string;
      bic?: string;
    };
  }) => {
    return apiClient.post<{
      message: string;
      requestId: string;
      amount: number;
      accountHolder: string;
      status: string;
    }>('/seller/payout-request', params);
  },

  /**
   * Get seller balance
   */
  getSellerBalance: async () => {
    return apiClient.get<{
      availableBalance: number;
      pendingBalance: number;
      totalEarned: number;
      withdrawnBalance: number;
    }>('/seller/balance');
  },

  /**
   * Get payout request history
   */
  getPayoutRequests: async (limit: number = 20, status?: string) => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (status) params.append('status', status);
    return apiClient.get<{
      payoutRequests: Array<{
        id: string;
        amount: number;
        status: string;
        requestedAt: string;
        bankDetails: {
          iban: string;
          accountHolder: string;
          bankName?: string;
          bic?: string;
        };
      }>;
      total: number;
    }>(`/seller/payout-requests?${params.toString()}`);
  },
};

export default apiClient;
