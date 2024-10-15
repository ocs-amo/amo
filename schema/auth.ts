import { z } from "zod"

export const SigninSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      message: "メールアドレスは必須です。",
    })
    .email({
      message: "無効なメールアドレスです。",
    }),
  password: z.string().min(1, {
    message: "パスワードは必須です。",
  }),
})

export type SigninForm = z.infer<typeof SigninSchema>
