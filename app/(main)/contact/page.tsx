import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-8 md:py-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-muted-foreground mt-2">
          Have a question or want to commission a piece? Get in touch.
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
