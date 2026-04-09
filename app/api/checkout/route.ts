import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CartItem = {
  title: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  const {
    items,
    customerName,
    shippingAddress,
    clerkUserId,
  }: {
    items: CartItem[];
    customerName: string;
    shippingAddress: string;
    clerkUserId?: string;
  } = await req.json();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "sgd",
    metadata: {
      customer_name: customerName,
      shipping_address: shippingAddress,
      clerk_user_id: clerkUserId ?? "",
      items: JSON.stringify(items),
    },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
