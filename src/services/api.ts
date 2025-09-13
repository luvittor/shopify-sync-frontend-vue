// Types for API responses
export type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  shopify_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type SyncResult = {
  synced: number;
  skipped: number;
  total: number;
};

export type ClearResult = {
  cleared: number;
};

export type ProductsResponse = {
  products: Product[];
  count: number;
};

// Get base URL from environment variable
const getBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL environment variable is not set');
  }
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

// Safely concatenate URL paths
const buildUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Typed HTTP helper using fetch
export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      'Accept': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody.message === 'string') {
        errorMessage = errorBody.message;
      }
    } catch {
      // If parsing JSON fails, use the default error message
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

// API endpoint functions
export const api = {
  // GET /v1/products
  async getProducts(): Promise<Product[]> {
    const response = await http<ProductsResponse>(buildUrl('/v1/products'));
    return response.products;
  },

  // POST /v1/products/sync
  async syncProducts(): Promise<SyncResult> {
    return http<SyncResult>(buildUrl('/v1/products/sync'), {
      method: 'POST',
    });
  },

  // DELETE /v1/products/clear
  async clearProducts(): Promise<ClearResult> {
    return http<ClearResult>(buildUrl('/v1/products/clear'), {
      method: 'DELETE',
    });
  },
};