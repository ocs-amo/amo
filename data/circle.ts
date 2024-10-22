"use server"
import type { BackCreateCircleForm } from "@/schema/circle"
import { db } from "@/utils/db"

export const addCircle = async (values: BackCreateCircleForm) => {
  try {
    const circle = await db.circle.create({
      data: {
        name: values.name,
        description: values.description,
        location: values.location,
        imagePath: values.imagePath,
        activityDay: values.activityDay,
      },
    })
    return circle // 成功した場合は作成したサークルを返す
  } catch (error) {
    console.error("Failed to add circle: ", error)
    return null // エラーが発生した場合はnullを返す
  }
}

export const addInitialMember = async (circleId: string, userId: string) => {
  try {
    const member = await db.circleMember.create({
      data: {
        circleId,
        userId,
        roleId: 0, // 代表の役割IDを適切に設定
      },
    })
    return member // 成功した場合は追加したメンバーを返す
  } catch (error) {
    console.error("Failed to add initial member: ", error)
    return null // エラーが発生した場合はnullを返す
  }
}

export const addInstructors = async (
  circleId: string,
  instructorIds: string[],
) => {
  try {
    const instructorsData = instructorIds.map((instructorId) => ({
      circleId,
      userId: instructorId,
    }))

    const result = await db.circleInstructor.createMany({
      data: instructorsData,
    })
    return result // 成功した場合は結果を返す
  } catch (error) {
    console.error("Failed to add instructors: ", error)
    return null // エラーが発生した場合はnullを返す
  }
}

export const addTags = async (circleId: string, tags: string[]) => {
  try {
    const tagsData = tags.map((tagName) => ({
      circleId,
      tagName,
    }))

    const result = await db.circleTag.createMany({
      data: tagsData,
    })
    return result // 成功した場合は結果を返す
  } catch (error) {
    console.error("Failed to add tags: ", error)
    return null // エラーが発生した場合はnullを返す
  }
}

export const getMemberByCircleId = async (circleId: string) => {
  try {
    const members = await db.circleMember.findMany({
      where: {
        circleId: circleId, // 特定のサークルIDに関連するメンバーをフィルタリング
      },
      include: {
        user: true, // 関連するユーザー情報を含める
      },
    })

    return members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      iconImagePath: member.user.iconImagePath,
      studentNumber: member.user.studentNumber,
      profileText: member.user.profileText,
      joinDate: member.joinDate,

      // role: member.role.roleName, // ロール名を含める
    }))
  } catch (error) {
    console.error("getMemberByCircleId: ", error)
    return null
  }
}

export const getCircleById = async (id: string) => {
  try {
    const circle = await db.circle.findUnique({
      where: {
        id,
      },
      include: {
        CircleMember: {
          include: {
            user: true, // 関連するユーザー情報を含める
            role: true,
          },
        },
        CircleInstructor: {
          include: {
            user: true, // 関連するユーザー情報を含める
          },
        },
        CircleTag: true,
        _count: {
          select: { CircleMember: true }, // メンバーの数をカウント
        },
      },
    })

    return {
      ...circle,
      memberCount: circle?._count.CircleMember,
      members: circle?.CircleMember.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        iconImagePath: member.user.iconImagePath,
        studentNumber: member.user.studentNumber,
        profileText: member.user.profileText,
        joinDate: member.joinDate,
        role: member.role.roleName,
      })),
      instructors: circle?.CircleInstructor.map((instructor) => ({
        id: instructor.user.id,
        name: instructor.user.name,
        email: instructor.user.email,
        iconImagePath: instructor.user.iconImagePath,
        studentNumber: instructor.user.studentNumber,
        profileText: instructor.user.profileText,
      })),
      tags: circle?.CircleTag.map((tag) => ({
        id: tag.id,
        tagName: tag.tagName,
      })),
    }
  } catch (error) {
    console.error("getCircleById: ", error)
    return null
  }
}

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
