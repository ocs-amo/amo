import { z } from "zod"
import { getBase64Image, MAX_BASE64_SIZE, sizeInMB } from "@/utils/file"

// 画像専用のスキーマ
export const AlbumImageSchema = z
  .array(z.union([z.instanceof(File), z.string()]))
  .nonempty("画像は最低1枚以上アップロードしてください。")
  .max(10, "画像は最大10枚までアップロード可能です。")
  .refine(
    (files) =>
      files.every(
        (file) =>
          typeof file === "string" || // 文字列の場合はそのまま通過
          file.type.startsWith("image/"), // File の場合は type をチェック
      ),
    "画像ファイルのみアップロード可能です。",
  )
  .refine(
    (files) =>
      files.every(
        (file) =>
          typeof file === "string" || // 文字列の場合はサイズチェック不要
          sizeInMB(file.size) <= MAX_BASE64_SIZE,
      ),
    `各画像のファイルサイズは最大1MBまでです。`,
  )
  .transform(async (files) => {
    // `string` はそのまま、`File` は base64 に変換
    return await Promise.all(
      files.map((file) =>
        typeof file === "string" ? file : getBase64Image(file),
      ),
    )
  })

// フロントエンド用スキーマ
export const AlbumFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "タイトルは必須です。" })
    .max(20, { message: "20文字以下にしてください。" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "内容は必須です。" })
    .max(1000, { message: "1000文字以下にしてください。" }),
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
