import { createServiceClient } from "@/lib/supabase";
import { OrdersTable } from "./OrdersTable";
import type { Order } from "@/lib/supabase";

async function getOrders(): Promise<Order[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
  return data as Order[];
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main className="px-4 py-8 md:px-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders.length} order{orders.length !== 1 && "s"} · live updates enabled
          </p>
        </div>
      </div>
      <OrdersTable initial={orders} />
    </main>
  );
}
