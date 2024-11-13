"use server"

import { getUserById } from "../user/user"
import { auth } from "@/auth"
import { updateActivity } from "@/data/activity"
import { getMemberByCircleId } from "@/data/circle"
import type { ActivityFormType } from "@/schema/activity"

export const editActivity = async (
  data: ActivityFormType,
  circleId: string,
  userId: string,
  activityId: number,
) => {
  const session = await auth()

  // 認証されたユーザーIDとリクエストのuserIdが一致しているか確認
  if (!session?.user || session.user.id !== userId) {
    return { success: false, error: "権限がありません。" }
  }

  // メンバー情報を取得
  const members = await getMemberByCircleId(circleId)

  // 管理者権限の確認
  const isMember = members?.some((member) => member.id === userId)

  if (!isMember) {
    return { success: false, error: "権限がありません。" }
  }
  const user = await getUserById(userId)
  if (!user) {
    return { success: false, error: "ユーザーが存在しません。" }
  }

  try {
    // Prismaのロジックを呼び出し
    const newActivity = await updateActivity(data, activityId)
    return { success: true, activity: newActivity }
  } catch (error) {
    console.error("活動日作成エラー:", error)
    return { success: false, error: "活動日の作成に失敗しました。" }
  }
}
