"use server"

import { auth } from "@/auth"
import { getMemberByCircleId } from "@/data/circle"
import { createThread } from "@/data/thread"
import type { ThreadFormInput } from "@/schema/topic"
import { ThreadFormSchema } from "@/schema/topic"

export const submitThread = async (
  formData: ThreadFormInput,
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
    const parsedData = ThreadFormSchema.safeParse(formData)
    if (!parsedData.success) {
      // バリデーションエラー時の処理
      return {
        success: false,
        error: parsedData.error.errors.map((e) => e.message).join(", "),
      }
    }

    // Prismaで新規スレッド作成
    const result = await createThread(parsedData.data, userId, circleId)
    return { success: true, data: result }
  } catch (error) {
    console.error("スレッドの作成に失敗しました:", error)
    return { success: false, error: "予期しないエラーが発生しました。" }
  }
}
