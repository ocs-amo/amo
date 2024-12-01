"use server"

import { AuthError } from "next-auth"
import { signIn } from "auth"
import { getUserByEmail } from "data/user"
import type { SigninForm } from "schema/auth"
import { SigninSchema } from "schema/auth"

export async function signin(values: SigninForm) {
  const validatedFields = SigninSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "メールアドレスかパスワードが間違っています。" }
  }

  const { email, password } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "メールアドレスが存在しません。" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "メールアドレスかパスワードが間違っています。" }
        default:
          return { error: "サーバーエラー" }
      }
    }

    throw error
  }
}
