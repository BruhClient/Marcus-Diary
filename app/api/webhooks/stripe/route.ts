import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const meta = intent.metadata;

    let items: { title: string; price: number; quantity: number }[] = [];
    try {
      items = JSON.parse(meta.items ?? "[]");
    } catch {
      items = [];
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const supabase = createServiceClient();
    const { error } = await supabase.from("orders").insert({
      stripe_payment_id: intent.id,
      customer_name: meta.customer_name ?? "",
      shipping_address: meta.shipping_address ?? "",
      customer_clerk_id: meta.clerk_user_id || null,
      items,
      total,
      status: "paid",
    });

    if (error) {
      console.error("Failed to save order:", error);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
