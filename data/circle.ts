"use server"
import { db } from "@/utils/db"

export const getCircles = async () => {
  try {
    const circles = await db.circle.findMany({
      include: {
        _count: {
          select: { CircleMember: true }, // メンバー数をカウント
        },
      },
    })

    return circles.map((circle) => ({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      location: circle.location,
      imagePath: circle.imagePath,
      activityDay: circle.activityDay,
      memberCount: circle._count.CircleMember, // メンバー合計
    }))
  } catch (error) {
    console.error("getCircles: ", error)
    return null
  }
}

export const getCirclesByUserId = async (userId: string) => {
  try {
    const circles = await db.circle.findMany({
      where: {
        CircleMember: {
          some: {
            userId: userId, // 特定のユーザーIDに関連するサークルをフィルタリング
          },
        },
      },
      include: {
        _count: {
          select: { CircleMember: true }, // メンバー数をカウント
        },
      },
    })

    return circles.map((circle) => ({
      id: circle.id,
      name: circle.name,
      description: circle.description,
      location: circle.location,
      imagePath: circle.imagePath,
      activityDay: circle.activityDay,
      memberCount: circle._count.CircleMember, // メンバー合計
    }))
  } catch (error) {
    console.error("getCirclesByUserId: ", error)
    return null
  }
}
