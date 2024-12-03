"use server"

import { getUserById } from "../user/user"
import { auth } from "@/auth"
import { getActivityById, updateActivity } from "@/data/activity"
import { isUserAdmin } from "@/data/circle"
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
  const user = await getUserById(userId)
  if (!user) {
    return { success: false, error: "ユーザーが存在しません。" }
  }

  // メンバー情報を取得して管理者権限を確認
  const isAdmin = await isUserAdmin(userId, circleId)
  const activity = await getActivityById(activityId)
  if (!isAdmin && activity?.createdBy !== userId) {
    return { success: false, error: "管理者権限がありません。" }
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
