"use server"

import { auth } from "auth"
import { deleteCircle, isUserAdmin } from "data/circle"

// サーバーアクション：サークル削除
export const removeCircle = async (circleId: string, userId: string) => {
  // 認証情報を取得
  const session = await auth()

  // 認証されたユーザーIDとリクエストのuserIdが一致しているか確認
  if (!session?.user || session.user.id !== userId) {
    return {
      success: false,
      message: "権限がありません。",
    }
  }
  try {
    const currentUser = await isUserAdmin(userId, circleId)
    if (!currentUser || currentUser.roleId !== 0) {
      return {
        success: false,
        message: "管理者の権限がありません。",
      }
    }

    // サークルの論理削除
    const deletedCircle = await deleteCircle(circleId)

    // 削除が成功したかどうかを確認
    if (!deletedCircle) {
      return {
        success: false,
        message:
          "サークルの削除に失敗しました。サークルが存在しないか、すでに削除されています。",
      }
    }

    return {
      success: true,
      message: `サークル ${deletedCircle.name} が正常に削除されました。`,
    }
  } catch (error) {
    console.error("サークル削除エラー:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "不明なエラーが発生しました。",
    }
  }
}
