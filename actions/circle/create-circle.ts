"use server"
import {
  addCircle,
  addInitialMember,
  addInstructors,
  addTags,
} from "@/data/circle"
import { getUserById } from "@/data/user"
import type { BackCircleForm } from "@/schema/circle"
import { BackCircleSchem } from "@/schema/circle"

export const CreateCircle = async (values: BackCircleForm, userId: string) => {
  const { success, error } = BackCircleSchem.safeParse(values)

  if (!success && error) {
    return { error }
  }

  const user = await getUserById(userId)
  if (!user) {
    return {
      error: "ユーザーが存在しません。",
    }
  }

  const circle = await addCircle(values)
  if (!circle) {
    return {
      error: "サークルの作成に失敗しました。",
    }
  }

  const initialMember = await addInitialMember(circle.id, userId)
  if (!initialMember) {
    return {
      error: "ユーザーの登録に失敗しました。",
    }
  }

  const instructors = await addInstructors(circle.id, values.instructors)
  if (!instructors) {
    return {
      error: "講師の登録に失敗しました。",
    }
  }

  const tags = await addTags(circle.id, values.tags)
  if (!tags) {
    return {
      error: "タグの登録に失敗しました。",
    }
  }

  // 成功時にサークルの情報を返す
  return {
    circleId: circle.id,
    name: circle.name,
    description: circle.description,
    location: circle.location,
    imagePath: circle.imagePath,
    activityDay: circle.activityDay,
    initialMemberId: userId, // 初期メンバーのIDも返す
    instructors, // 講師のデータも返す
    tags, // タグのデータも返す
  }
}
