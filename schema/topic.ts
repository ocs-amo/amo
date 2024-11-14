import { z } from "zod"

// 1. スレッド作成用のスキーマ
export const ThreadFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルを入力してください")
      .max(100, "タイトルは100文字以内で入力してください"),
    content: z
      .string()
      //   .min(1, "詳細を入力してください")
      .max(5000, "詳細は5000文字以内で入力してください")
      .optional(),
  })
  .brand<"ThreadForm">()

export type ThreadFormInput = z.infer<typeof ThreadFormSchema>

// 2. コメント投稿用のスキーマ
export const CommentFormSchema = z
  .object({
    content: z
      .string()
      .min(1, "コメント内容を入力してください")
      .max(2000, "コメントは2000文字以内で入力してください"),
  })
  .brand<"CommentForm">()

export type CommentFormInput = z.infer<typeof CommentFormSchema>

// 3. お知らせ作成用のスキーマ
export const AnnouncementFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルを入力してください")
      .max(100, "タイトルは100文字以内で入力してください"),
    content: z
      .string()
      .min(1, "お知らせ内容を入力してください")
      .max(5000, "お知らせは5000文字以内で入力してください"),
  })
  .brand<"AnnouncementForm">()

export type AnnouncementFormInput = z.infer<typeof AnnouncementFormSchema>
