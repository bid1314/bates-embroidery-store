import { createClient } from '@supabase/supabase-js';

// Create Supabase client for client-side usage
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create Supabase client with service role for server-side usage
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types for multi-tenant structure
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  settings: {
    theme?: any;
    currency?: string;
    language?: string;
    timezone?: string;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category_id?: string;
  collection_ids: string[];
  inventory_quantity: number;
  active: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_id?: string;
  customer_email: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  currency: string;
  items: OrderItem[];
  shipping_address: any;
  billing_address: any;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed';
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

// Helper function to get tenant by domain/subdomain
export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .or(`domain.eq.${domain},subdomain.eq.${domain}`)
    .eq('active', true)
    .single();
    
  if (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }
  
  return data;
}

// Helper function to get products for a tenant
export async function getTenantProducts(
  tenantId: string,
  options?: {
    category?: string;
    collection?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('active', true);
    
  if (options?.category) {
    query = query.eq('category_id', options.category);
  }
  
  if (options?.collection) {
    query = query.contains('collection_ids', [options.collection]);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
} 