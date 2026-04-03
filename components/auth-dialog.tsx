"use client";

import { useState } from "react";
import { SignIn, useAuth, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";

export function AuthDialog() {
  const { isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Sign in">
          <User className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="p-0 w-auto border-none bg-transparent shadow-none">
        <VisuallyHidden.Root>
          <DialogTitle>Sign in</DialogTitle>
        </VisuallyHidden.Root>
        <SignIn routing="hash" />
      </DialogContent>
    </Dialog>
  );
}
