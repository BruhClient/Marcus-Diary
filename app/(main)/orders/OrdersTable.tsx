"use client";

import { useEffect, useState } from "react";
import { supabase, type Order } from "@/lib/supabase";
import { cn } from "@/lib/utils";

function statusBadge(status: string) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        status === "paid" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        status === "refunded" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        status === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      )}
    >
      {status}
    </span>
  );
}

export function OrdersTable({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initial);
  const [newId, setNewId] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const order = payload.new as Order;
          setOrders((prev) => [order, ...prev]);
          setNewId(order.id);
          setTimeout(() => setNewId(null), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (orders.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-20">No orders yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Date</th>
            <th className="px-4 py-3 text-left font-medium">Customer</th>
            <th className="px-4 py-3 text-left font-medium">Shipping address</th>
            <th className="px-4 py-3 text-left font-medium">Items</th>
            <th className="px-4 py-3 text-right font-medium">Total</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr
              key={order.id}
              className={cn(
                "transition-colors duration-700",
                newId === order.id ? "bg-green-50 dark:bg-green-900/10" : "bg-background"
              )}
            >
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("en-SG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-4 py-3 font-medium">{order.customer_name}</td>
              <td className="px-4 py-3 text-muted-foreground max-w-xs">
                {order.shipping_address}
              </td>
              <td className="px-4 py-3">
                <ul className="flex flex-col gap-0.5">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-muted-foreground">
                      {item.quantity > 1 && (
                        <span className="font-medium text-foreground">{item.quantity}× </span>
                      )}
                      {item.title}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">
                S${Number(order.total).toFixed(2)}
              </td>
              <td className="px-4 py-3">{statusBadge(order.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
