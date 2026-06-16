import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (NO database adapter, NO node-only providers).
 * Used by `middleware.ts` to read the JWT cookie and gate routes. The full
 * config in `auth.ts` spreads this and adds the Prisma adapter + providers.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [], // node-only providers are added in auth.ts
  callbacks: {
    // Route protection. Returning false on a protected route redirects to signIn.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnStudio = nextUrl.pathname.startsWith("/studio");
      if (isOnStudio) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
