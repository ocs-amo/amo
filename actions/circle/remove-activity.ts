"use server"
import { auth } from "../../auth"
import { deleteActivity } from "../../data/activity"
import { isUserAdmin } from "../../data/circle"

// 活動日の削除アクション
export const removeActivityAction = async (
  activityId: number,
  circleId: string,
  userId: string,
) => {
  // 認証情報を取得
  const session = await auth()

  // 認証されたユーザーIDとリクエストのuserIdが一致しているか確認
  if (!session?.user || session.user.id !== userId) {
    return { success: false, error: "権限がありません。" }
  }

  // メンバー情報を取得して管理者権限を確認
  const isAdmin = isUserAdmin(userId, circleId)
  if (!isAdmin) {
    return { success: false, error: "管理者権限がありません。" }
  }

  try {
    // Prismaの削除ロジックを呼び出し
    await deleteActivity(activityId)
    return { success: true }
  } catch (error) {
    console.error("活動日削除エラー:", error)
    return { success: false, error: "活動日の削除に失敗しました。" }
  }
}
