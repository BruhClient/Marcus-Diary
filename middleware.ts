import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isOrdersRoute = createRouteMatcher(["/orders(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isOrdersRoute(req)) {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role;

    console.log("[orders] userId:", userId);
    console.log("[orders] sessionClaims:", JSON.stringify(sessionClaims, null, 2));
    console.log("[orders] role from claims:", role);

    if (!userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Fetch directly from Clerk API to bypass session token caching
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    console.log("[orders] publicMetadata from API:", JSON.stringify(user.publicMetadata, null, 2));
    const apiRole = (user.publicMetadata as { role?: string })?.role;
    console.log("[orders] role from API:", apiRole);

    if (apiRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
