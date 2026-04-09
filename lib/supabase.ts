import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Browser client (publishable key, safe to expose)
export const supabase = createClient(url, publishableKey);

// Server-only client with full access — never import this in client components
export function createServiceClient() {
  return createClient(url, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false },
  });
}

export type Order = {
  id: string;
  stripe_payment_id: string;
  customer_name: string;
  shipping_address: string;
  customer_clerk_id: string | null;
  items: { title: string; price: number; quantity: number }[];
  total: number;
  status: string;
  created_at: string;
};
