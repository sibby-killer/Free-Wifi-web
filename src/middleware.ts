import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/terms',
  '/privacy',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all other routes
  // Protect all other routes
  const { userId } = await auth();
  if (!userId) {
    // Return 401 for API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Redirect to sign-in for pages
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check email domain on sign-up/onboarding
  if (isOnboardingRoute(req)) {
    const { clerkClient } = await import('@clerk/nextjs/server');
    const user = await (await clerkClient()).users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress || '';

    // Enforce Gmail only policy
    if (!email.endsWith('@gmail.com')) {
      // Delete the user and redirect to sign-up with error
      await (await clerkClient()).users.deleteUser(userId);
      const signUpUrl = new URL('/sign-up', req.url);
      return NextResponse.redirect(signUpUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
