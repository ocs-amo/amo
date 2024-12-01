import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { db } from "./utils/db"

const config: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日間
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "microsoft-entra-id" && profile?.email) {
          delete profile.email_verified
          // emailから「@」の前の部分を抽出
          const studentNumber = profile.email.split("@")[0]
          // もし学籍番号でないなら講師フラグをつける
          const isInstructor = isNaN(parseInt(studentNumber))
          if (isInstructor) {
            user.instructorFlag = true
            user.studentNumber = ""
          } else {
            user.studentNumber = studentNumber
          }
        }
        return true
      } catch (error) {
        console.error("signIn Error: ", error)

        return false
      }
    },
    async jwt({ token, account, user }) {
      if (account && account.provider === "microsoft-entra-id") {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
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
  debug: process.env.NODE_ENV === "development",
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  ...authConfig,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
