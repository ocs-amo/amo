// /app/(circle)/[circleId]/activities/actions.ts
"use server"

import { createActivity } from "@/data/activity"
import { getMemberByCircleId } from "@/data/circle"
import { getUserById } from "@/data/user"
import type { ActivityFormType } from "@/schema/activity"

export const addActivityAction = async (
  data: ActivityFormType,
  circleId: string,
  userId: string,
) => {
  // メンバー情報を取得
  const members = await getMemberByCircleId(circleId)

  // 管理者権限の確認
  const isMember = members?.some((member) => member.id === userId)

  if (!isMember) {
    throw new Error("権限がありません。")
  }
  const user = await getUserById(userId)
  if (!user) {
    throw new Error("ユーザーが存在しません。")
  }
  try {
    // Prismaのロジックを呼び出し
    const newActivity = await createActivity(data, circleId, user.id)
    return { success: true, activity: newActivity }
  } catch (error) {
    console.error("活動日作成エラー:", error)
    return { success: false, error: "活動日の作成に失敗しました。" }
  }
}
