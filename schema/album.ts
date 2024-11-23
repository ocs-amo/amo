import { z } from "zod"

// 画像専用のスキーマ
export const AlbumImageSchema = z
  .array(z.instanceof(File))
  .nonempty("画像は最低1枚以上アップロードしてください。")
  .max(10, "画像は最大10枚までアップロード可能です。")
  .refine(
    (files) => files.every((file) => file.type.startsWith("image/")),
    "画像ファイルのみアップロード可能です。",
  )

// フロントエンド用スキーマ
export const AlbumFormSchema = z
  .object({
    title: z.string().trim().min(1, { message: "タイトルは必須です。" }),
    description: z.string().trim().min(1, { message: "内容は必須です。" }),
    images: AlbumImageSchema,
  })
  .brand<"AlbumFormSchema">()

export type FrontAlbumForm = z.infer<typeof AlbumFormSchema>

// バックエンド用スキーマ
export const BackAlbumSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    images: z.array(z.string()).min(1, { message: "画像は最低1枚必要です。" }), // 最低1枚以上
  })
  .brand<"BackAlbumSchema">()

export type BackAlbumForm = z.infer<typeof BackAlbumSchema>
