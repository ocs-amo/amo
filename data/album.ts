import { db } from "@/utils/db"

/**
 * アルバムを作成する
 * @param title アルバムのタイトル
 * @param description アルバムの説明
 * @param circleId サークルID
 * @param createdBy 作成者のユーザーID
 * @param images 画像URLのリスト
 */
export async function createAlbum(
  title: string,
  description: string,
  circleId: string,
  createdBy: string,
  images: string[],
) {
  return db.$transaction(async (tx) => {
    // アルバムを作成
    const album = await tx.album.create({
      data: {
        title,
        description,
        circleId,
        createdBy,
      },
    })

    // 画像を登録
    if (images.length > 0) {
      await tx.albumImage.createMany({
        data: images.map((imageUrl) => ({
          albumId: album.id,
          imageUrl,
        })),
      })
    }

    return album
  })
}

export const getAlbumsByCircleId = async (circleId: string) =>
  await db.album.findMany({
    where: {
      circleId,
      deletedAt: null,
    },
    include: {
      images: true,
    },
  })
