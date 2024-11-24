"use server"
import { getUserById } from "../user/user"
import { auth } from "@/auth"
import { createAlbum, getAlbumsByCircleId } from "@/data/album"
import { getMemberByCircleId } from "@/data/circle"
import type { BackAlbumForm } from "@/schema/album"

/**
 * サーバーアクション関数
 */
export async function handleCreateAlbum(data: BackAlbumForm, circleId: string) {
  const session = await auth()
  const user = await getUserById(session?.user?.id || "")
  // メンバー情報を取得
  const members = await getMemberByCircleId(circleId)

  // 管理者権限の確認
  const isMember = members?.some((member) => member.id === user?.id)

  if (!session || !user || !isMember) {
    return {
      success: false,
      error: "権限がありません。",
    }
  }

  const { title, description, images } = data

  try {
    // アルバムを作成
    const album = await createAlbum(
      title,
      description,
      circleId,
      user.id,
      images,
    )

    return {
      success: true,
      data: album,
    }
  } catch (error) {
    console.error("アルバム作成中にエラーが発生しました:", error)
    return {
      success: false,
      error: "アルバム作成に失敗しました。",
    }
  }
}

export const handleGetAlbumsByCircleId = async (circleId: string) =>
  await getAlbumsByCircleId(circleId)
