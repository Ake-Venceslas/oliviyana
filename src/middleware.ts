import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type SessionClaimsWithRole = {
  metadata?: {
    role?: string;
  };
};

const isDoctorRoute = createRouteMatcher(['/dashboard/doctors(.*)']);
const isPatientRoute = createRouteMatcher(['/dashboard/patients(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();

  // Si l'utilisateur accède à une route protégée
  if (isDoctorRoute(req)) {
    if (!userId) {
      // Pas connecté, rediriger vers login
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // Vérifier que l'utilisateur a le rôle "doctor"
    const userRole = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
    if (userRole && userRole !== 'doctor') {
      // Rôle incorrect, rediriger vers accès refusé
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }
  }

  if (isPatientRoute(req)) {
    if (!userId) {
      // Pas connecté, rediriger vers login
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // Vérifier que l'utilisateur a le rôle "patient"
    const userRole = (sessionClaims as SessionClaimsWithRole)?.metadata?.role;
    if (userRole && userRole !== 'patient') {
      // Rôle incorrect, rediriger vers accès refusé
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};