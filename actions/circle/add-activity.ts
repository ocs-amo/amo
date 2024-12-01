"use server"

import { auth } from "../../auth"
import { createActivity } from "../../data/activity"
import { getMemberByCircleId } from "../../data/circle"
import type { ActivityFormType } from "../../schema/activity"
import { getUserById } from "../user/user"

export const addActivityAction = async (
  data: ActivityFormType,
  circleId: string,
  userId: string,
) => {
  // 認証情報を取得
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
    const newActivity = await createActivity(data, circleId, user.id)
    return { success: true, activity: newActivity }
  } catch (error) {
    console.error("活動日作成エラー:", error)
    return { success: false, error: "活動日の作成に失敗しました。" }
  }
}
