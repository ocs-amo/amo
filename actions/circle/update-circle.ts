"use server"
import { getUserById } from "../user/user"
import { auth } from "@/auth"
import {
  getMemberByCircleId,
  updateInstructors,
  updateTags,
  updateCircle,
} from "@/data/circle"
import type { BackCircleForm } from "@/schema/circle"
import { BackCircleSchema } from "@/schema/circle"

export const UpdateCircle = async (
  values: BackCircleForm,
  circleId: string,
  userId: string,
) => {
  // 認証情報を取得
  const session = await auth()

  // 認証されたユーザーIDとリクエストのuserIdが一致しているか確認
  if (!session?.user || session.user.id !== userId) {
    return {
      success: false,
      message: "権限がありません。",
    }
  }
  // バリデーションの実行
  const { success, error } = BackCircleSchema.safeParse(values)
  if (!success && error) {
    return { error }
  }

  // メンバー情報を取得
  const members = await getMemberByCircleId(circleId)

  // 管理者権限の確認
  const isAdmin = members?.some(
    (member) => member.id === userId && [0, 1].includes(member.role.id),
  )

  if (!isAdmin) {
    return { error: "権限がありません。" }
  }

  // ユーザー情報の取得
  const user = await getUserById(userId)
  if (!user) {
    return { error: "ユーザーが存在しません。" }
  }

  // サークルの更新処理
  const updatedCircle = await updateCircle(circleId, values)
  if (!updatedCircle) {
    return { error: "サークルの更新に失敗しました。" }
  }

  // 講師の更新処理
  const updatedInstructors = await updateInstructors(
    circleId,
    values.instructors,
  )
  if (updatedInstructors === null) {
    return { error: "講師の更新に失敗しました。" }
  }

  // タグの更新処理
  const updatedTags = await updateTags(circleId, values.tags)
  if (updatedTags === null) {
    return { error: "タグの更新に失敗しました。" }
  }

  // 成功時に更新されたサークル情報を返す
  return {
    circleId: updatedCircle.id,
    name: updatedCircle.name,
    description: updatedCircle.description,
    location: updatedCircle.location,
    imagePath: updatedCircle.imagePath,
    activityDay: updatedCircle.activityDay,
  }
}
