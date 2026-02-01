import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/reviews(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;
  
  // Protect all non-public routes
  await auth.protect();
  
  // Additional check for admin routes
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return Response.redirect(new URL("/", req.url));
    }
    
    // Check if user has admin role
    const { clerkClient } = await import("@clerk/nextjs/server");
    const user = await (await clerkClient()).users.getUser(userId);
    const role = user.publicMetadata?.role as string | undefined;
    
    if (role !== "admin") {
      return Response.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|.*\\.(?:css|js|json|jpg|jpeg|png|gif|svg|webp|ico|txt|map)$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
