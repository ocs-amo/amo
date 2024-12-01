import { z } from "zod"
import { getBase64Image } from "../utils/file"

// 共通の基本スキーマ（バックエンドでも使用）
export const CircleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "サークル名は必須です。" })
    .max(30, { message: "30文字以下にしてください。" }), // サークル名は必須
  description: z
    .string()
    .trim()
    .min(1, { message: "説明は必須です。" })
    .max(100, { message: "100文字以下にしてください。" }), // 説明は必須
  instructors: z
    .array(z.string())
    .nonempty("講師を少なくとも一人選択してください"), // 講師は文字列配列
  location: z
    .string()
    .min(1, { message: "活動場所は必須です。" })
    .max(20, { message: "20文字以下にしてください。" }), // 活動場所は必須
  activityDay: z
    .string()
    .min(1, { message: "活動日は必須です。" })
    .max(10, { message: "10文字以下にしてください。" }), // 活動日は必須
})

// フロントエンド用のスキーマ
export const FrontCircleSchema = CircleSchema.extend({
  tags: z
    .string() // カンマ区切りの文字列を受け取る
    .transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ), // 文字列を配列に変換
  imagePath: z
    .custom<FileList>()
    .optional() // 画像ファイルはオプション
    .refine(
      (file) =>
        typeof file === "string" ||
        !file ||
        file.length === 0 ||
        (file.length > 0 && file[0].type.startsWith("image/")),
      {
        message: "画像ファイルを選択してください",
      },
    )
    .transform(async (file) => {
      if (typeof file === "string" || !file || file.length === 0) {
        return null // 画像がない場合はnullを返す
      }
      const selectedFile = file[0]
      return await getBase64Image(selectedFile)
    }),
})

// バックエンド用のスキーマ
export const BackCircleSchema = CircleSchema.extend({
  tags: z.array(z.string()), // バックエンドでは既に配列として受け取る
  imagePath: z.string().optional().nullable(), // 画像データはbase64の文字列として受け取る
})

export type CircleForm = z.infer<typeof CircleSchema>
export type FrontCircleForm = z.infer<typeof FrontCircleSchema>
export type BackCircleForm = z.infer<typeof BackCircleSchema>
