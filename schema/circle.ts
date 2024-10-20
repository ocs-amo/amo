import { z } from "zod"

// 共通の基本スキーマ（バックエンドでも使用）
export const CreateCircleSchema = z.object({
  name: z.string().trim().min(1, { message: "サークル名は必須です。" }), // サークル名は必須
  description: z.string().trim().min(1, { message: "説明は必須です。" }), // 説明は必須
  instructors: z
    .array(z.string())
    .nonempty("講師を少なくとも一人選択してください"), // 講師は文字列配列
  location: z.string().min(1, { message: "活動場所は必須です。" }), // 活動場所は必須
  activityDay: z.string().min(1, { message: "活動日は必須です。" }), // 活動日は必須
})

// フロントエンド用のスキーマ
export const FrontCreateCircleSchema = CreateCircleSchema.extend({
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
        !file ||
        file.length === 0 ||
        (file.length > 0 && file[0].type.startsWith("image/")),
      {
        message: "画像ファイルを選択してください",
      },
    )
    .transform(async (file) => {
      if (!file || file.length === 0) {
        return null // 画像がない場合はnullを返す
      }
      const selectedFile = file[0]
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile) // 画像ファイルをbase64に変換
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
      })
    }),
})

// バックエンド用のスキーマ
export const BackCreateCircleSchema = CreateCircleSchema.extend({
  tags: z.array(z.string()), // バックエンドでは既に配列として受け取る
  imagePath: z.string().optional(), // 画像データはbase64の文字列として受け取る
})

export type CreateCircleForm = z.infer<typeof CreateCircleSchema>
export type FrontCreateCircleForm = z.infer<typeof FrontCreateCircleSchema>
export type BackCreateCircleForm = z.infer<typeof BackCreateCircleSchema>
