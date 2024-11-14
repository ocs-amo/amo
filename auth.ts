import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { db } from "./utils/db"

const config: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "microsoft-entra-id" && profile?.email) {
        delete profile.email_verified
        // emailから「@」の前の部分を抽出
        const studentNumber = profile.email.split("@")[0]
        user.studentNumber = studentNumber
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id && typeof token.id === "string") {
        session.user.id = token.id as string
      }
      return session
    },
  },
  // debug: process.env.NODE_ENV === "development",
  debug: true,
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  ...authConfig,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
