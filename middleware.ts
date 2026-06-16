import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-safe instance (no Prisma adapter) — only reads the JWT cookie and runs
// the `authorized` callback to gate /studio/*.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/studio/:path*"],
};
