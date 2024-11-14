import type { User as NextAuthUser } from "next-auth" // `next-auth`からUser型をインポート

declare module "next-auth" {
  interface User extends NextAuthUser {
    studentNumber: string // ここでstudentNumberを追加
  }
}
