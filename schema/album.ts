import { z } from "zod"
import { MAX_BASE64_SIZE, sizeInMB } from "@/utils/file"

// 画像専用のスキーマ
export const AlbumImageSchema = z
  .array(z.instanceof(File))
  .nonempty("画像は最低1枚以上アップロードしてください。")
  .max(10, "画像は最大10枚までアップロード可能です。")
  .refine(
    (files) => files.every((file) => file.type.startsWith("image/")),
    "画像ファイルのみアップロード可能です。",
  )
  .refine(
    (files) => files.every((file) => sizeInMB(file.size) <= MAX_BASE64_SIZE),
    `各画像のファイルサイズは最大1MBまでです。`,
  )

// フロントエンド用スキーマ
export const AlbumFormSchema = z.object({
  title: z.string().trim().min(1, { message: "タイトルは必須です。" }),
  description: z.string().trim().min(1, { message: "内容は必須です。" }),
})

export const FrontAlbumFormSchema = AlbumFormSchema.extend({
  images: AlbumImageSchema,
}).brand<"AlbumFormSchema">()

export type FrontAlbumForm = z.infer<typeof FrontAlbumFormSchema>

// バックエンド用スキーマ
export const BackAlbumSchema = AlbumFormSchema.extend({
  images: z
    .array(z.string())
    .min(1, "画像は最低1枚以上必要です。")
    .max(10, "画像は最大10枚までアップロード可能です。"),
}).brand<"BackAlbumSchema">()

export type BackAlbumForm = z.infer<typeof BackAlbumSchema>
