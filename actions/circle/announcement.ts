"use server"
import { auth } from "@/auth"
import { createAnnouncement } from "@/data/announcement"
import { getMemberByCircleId } from "@/data/circle"
import type { AnnouncementFormInput } from "@/schema/topic"
import { AnnouncementFormSchema } from "@/schema/topic"

export const submitAnnouncement = async (
  formData: AnnouncementFormInput,
  userId: string,
  circleId: string,
) => {
  try {
    // 認証チェック
    const session = await auth()
    if (!session || session.user?.id !== userId) {
      return { success: false, error: "ユーザー認証に失敗しました。" }
    }

    // サークルメンバーかどうかを確認
    const members = await getMemberByCircleId(circleId)
    const isMember = members?.some((member) => member.id === userId)
    if (!isMember) {
      return { success: false, error: "このサークルのメンバーではありません。" }
    }

    // Zodによる入力データのバリデーション
    const parsedData = AnnouncementFormSchema.safeParse(formData)
    if (!parsedData.success) {
      // バリデーションエラー時の処理
      return {
        success: false,
        error: parsedData.error.errors.map((e) => e.message).join(", "),
      }
    }

    // Prismaで新規スレッド作成
    const result = await createAnnouncement(parsedData.data, userId, circleId)
    return { success: true, data: result }
  } catch (error) {
    console.error("お知らせの作成に失敗しました:", error)
    return { success: false, error: "予期しないエラーが発生しました。" }
  }
}
