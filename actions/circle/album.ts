"use server"
import { auth } from "../../auth"
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAlbumsByCircleId,
  updateAlbum,
} from "../../data/album"
import { getMemberByCircleId } from "../../data/circle"
import type { BackAlbumForm } from "../../schema/album"
import { getUserById } from "../user/user"

export async function handleDeleteAlbum(circleId: string, albumId: string) {
  const session = await auth()
  const user = await getUserById(session?.user?.id || "")
  // メンバー情報を取得
  const members = await getMemberByCircleId(circleId)
  // 管理者権限の確認
  const isMember = members?.some((member) => member.id === user?.id)

  const currentAlbum = await getAlbumById(albumId)

  if (!session || !user || !isMember || !currentAlbum) {
    return {
      success: false,
      error: "権限がありません。",
    }
  }

  try {
    const deletedAlbum = await deleteAlbum(albumId)

    return {
      success: true,
      id: deletedAlbum.id,
    }
  } catch (error) {
    console.error("アルバム削除中にエラーが発生しました:", error)
    return {
      success: false,
      error: "アルバム削除に失敗しました。",
    }
  }
}

export async function handleUpdateAlbum(
  data: BackAlbumForm,
  circleId: string,
  albumId: string,
) {
  const session = await auth()
  const user = await getUserById(session?.user?.id || "")
  // メンバー情報を取得
  const members = await getMemberByCircleId(circleId)
  // 管理者権限の確認
  const isMember = members?.some((member) => member.id === user?.id)

  const currentAlbum = await getAlbumById(albumId)

  if (!session || !user || !isMember || !currentAlbum) {
    return {
      success: false,
      error: "権限がありません。",
    }
  }

  const { title, description, images } = data

  try {
    const newAlbum = await updateAlbum(
      currentAlbum.id,
      title,
      description,
      images,
    )
    return {
      success: true,
      data: newAlbum,
    }
  } catch (error) {
    console.error("アルバム更新中にエラーが発生しました:", error)
    return {
      success: false,
      error: "アルバム更新に失敗しました。",
    }
  }
}

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

export const handleGetAlbumById = async (albumId: string) =>
  await getAlbumById(albumId)
