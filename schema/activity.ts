import { z } from "zod"

export const ActivitySchema = z.object({
  // 必須項目: 見出し（タイトル）
  title: z
    .string()
    .trim()
    .min(1, { message: "活動タイトルは必須です。" })
    .max(30, { message: "30文字以下にしてください。" }),
  // 任意項目: 内容
  description: z
    .string()
    .max(200, { message: "200文字以下にしてください。" })
    .optional(),
  // 必須項目: 日付
  date: z.date({ required_error: "日付を設定してください。" }),
  // 任意項目: 場所
  location: z
    .string()
    .max(20, { message: "20文字以下にしてください。" })
    .optional(),
  // 必須項目: 開始時間 (時刻フォーマット)
  startTime: z.string().min(1, { message: "開始時間を設定してください。" }),
  // 任意項目: 終了時間 (時刻フォーマット)
  endTime: z.string().optional(),
  // 任意項目: 備考
  notes: z
    .string()
    .max(100, { message: "100文字以下にしてください。" })
    .optional(),
})

export type ActivityFormType = z.infer<typeof ActivitySchema>
