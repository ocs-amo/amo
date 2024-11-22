import { z } from "zod"

// フロントエンド用スキーマ
export const AlbumFormSchema = z
  .object({
    title: z.string().trim().min(1, { message: "タイトルは必須です。" }),
    description: z.string().trim().min(1, { message: "内容は必須です。" }),
    images: z
      .custom<FileList>()
      .refine(
        (files) =>
          files instanceof FileList &&
          files.length > 0 && // 最低1枚以上
          files.length <= 10 && // 最大10枚
          Array.from(files).every((file) => file.type.startsWith("image/")),
        {
          message:
            "画像は1枚以上10枚以下、かつ画像ファイルのみアップロード可能です。",
        },
      )
      .transform(async (files) => {
        const base64Promises = Array.from(files).map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
            }),
        )
        return Promise.all(base64Promises) // 全ての画像をbase64に変換
      }),
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
