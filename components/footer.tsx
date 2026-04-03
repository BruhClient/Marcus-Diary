import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/sanity";

type SocialLinks = {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  x?: string;
};

async function getSocialLinks(): Promise<SocialLinks> {
  return client.fetch(`*[_type == "socialLinks"][0]{ instagram, facebook, youtube, x }`) ?? {};
}

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialConfig = [
  { key: "instagram" as const, label: "Instagram", Icon: InstagramIcon },
  { key: "facebook" as const, label: "Facebook", Icon: FacebookIcon },
  { key: "youtube" as const, label: "YouTube", Icon: YoutubeIcon },
  { key: "x" as const, label: "X", Icon: XIcon },
];

export async function Footer() {
  const links = await getSocialLinks();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />

          {/* Social icons */}
          <div className="flex gap-2 text-muted-foreground">
            {socialConfig.map(({ key, label, Icon }) =>
              links[key] ? (
                <Button key={key} variant="ghost" size="icon" aria-label={label} asChild>
                  <Link href={links[key]!} target="_blank" rel="noopener noreferrer">
                    <Icon />
                  </Link>
                </Button>
              ) : null
            )}
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Goh Wei Yu Marcus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
