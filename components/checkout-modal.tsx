"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/cart-provider";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type ShippingInfo = {
  name: string;
  address: string;
};

function ShippingForm({ onNext }: { onNext: (info: ShippingInfo) => void }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;
    onNext({ name: name.trim(), address: address.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Full name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Marcus Goh"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Shipping address</label>
        <Textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Orchard Road, #01-01, Singapore 238858"
          rows={3}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Continue to Payment
      </Button>
    </form>
  );
}

function CheckoutForm({
  shipping,
  onSuccess,
}: {
  shipping: ShippingInfo;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/?success=true` },
      redirect: "if_required",
    });

    if (error) {
      setError(error.message ?? "Payment failed.");
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
        <p className="font-medium text-foreground">{shipping.name}</p>
        <p>{shipping.address}</p>
      </div>
      <ul className="text-sm divide-y divide-border">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between py-2">
            <span className="text-muted-foreground">
              {item.title} {item.quantity > 1 && `× ${item.quantity}`}
            </span>
            <span className="font-medium">S${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
        <li className="flex justify-between pt-2 font-semibold">
          <span>Total</span>
          <span>S${total.toFixed(2)}</span>
        </li>
      </ul>
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? "Processing..." : `Pay S$${total.toFixed(2)}`}
      </Button>
    </form>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CheckoutModal({ open, onClose }: Props) {
  const { items, clearCart } = useCart();
  const { userId } = useAuth();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStep("shipping");
      setShipping(null);
      setClientSecret(null);
      return;
    }
  }, [open]);

  async function handleShippingNext(info: ShippingInfo) {
    setShipping(info);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ title: i.title, price: i.price, quantity: i.quantity })),
        customerName: info.name,
        shippingAddress: info.address,
        clerkUserId: userId ?? undefined,
      }),
    });
    const { clientSecret } = await res.json();
    setClientSecret(clientSecret);
    setStep("payment");
  }

  function handleSuccess() {
    setStep("success");
    clearCart();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md w-full p-6">
        <DialogTitle className="text-lg font-bold mb-4">
          {step === "shipping" && "Shipping details"}
          {step === "payment" && "Payment"}
          {step === "success" && "Order placed!"}
        </DialogTitle>

        {step === "shipping" && (
          <ShippingForm onNext={handleShippingNext} />
        )}

        {step === "payment" && clientSecret && shipping && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm shipping={shipping} onSuccess={handleSuccess} />
          </Elements>
        )}

        {step === "payment" && !clientSecret && (
          <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <p className="text-lg font-semibold">Payment successful!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Thank you, {shipping?.name}. Your order is on its way.
            </p>
            <Button className="mt-4" onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
