"use server"
import type { BackCircleForm } from "@/schema/circle"
import { db } from "@/utils/db"

export const addCircle = async (values: BackCircleForm) => {
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

export const updateCircle = async (
  circleId: string,
  values: BackCircleForm,
) => {
  try {
    return await db.circle.update({
      where: { id: circleId },
      data: {
        name: values.name,
        description: values.description,
        location: values.location,
        imagePath: values.imagePath,
        activityDay: values.activityDay,
      },
    })
  } catch (error) {
    console.error("Failed to update circle: ", error)
    return null
  }
}

export const updateInstructors = async (
  circleId: string,
  newInstructors: string[],
) => {
  try {
    const existingInstructors = await db.circleInstructor.findMany({
      where: { circleId },
    })

    const newInstructorsSet = new Set(newInstructors)

    // トランザクションで削除と追加を行う
    const deletePromises = existingInstructors
      .filter((instructor) => !newInstructorsSet.has(instructor.userId))
      .map((instructor) =>
        db.circleInstructor.delete({
          where: { id: instructor.id },
        }),
      )

    const createPromises = newInstructors
      .filter(
        (instructorId) =>
          !existingInstructors.some(
            (instructor) => instructor.userId === instructorId,
          ),
      )
      .map((instructorId) =>
        db.circleInstructor.create({
          data: {
            circleId,
            userId: instructorId,
          },
        }),
      )

    await db.$transaction([...deletePromises, ...createPromises])

    return true
  } catch (error) {
    console.error("Failed to update instructors: ", error)
    return null
  }
}

export const updateTags = async (circleId: string, newTags: string[]) => {
  try {
    const existingTags = await db.circleTag.findMany({
      where: { circleId },
    })

    const newTagsSet = new Set(newTags)

    // トランザクションで削除と追加を行う
    const deletePromises = existingTags
      .filter((tag) => !newTagsSet.has(tag.tagName))
      .map((tag) =>
        db.circleTag.delete({
          where: { id: tag.id },
        }),
      )

    const createPromises = newTags
      .filter((newTag) => !existingTags.some((tag) => tag.tagName === newTag))
      .map((newTag) =>
        db.circleTag.create({
          data: {
            circleId,
            tagName: newTag,
          },
        }),
      )

    await db.$transaction([...deletePromises, ...createPromises])

    return true
  } catch (error) {
    console.error("Failed to update tags: ", error)
    return null
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

export const getInstructors = async () =>
  db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profileText: true,
      studentNumber: true,
      updatedAt: true,
      createdAt: true,
      iconImagePath: true,
      accounts: true,
    },
    where: {
      instructorFlag: true,
    },
  })

export const getMemberByCircleId = async (circleId: string) => {
  try {
    const members = await db.circleMember.findMany({
      where: {
        circleId: circleId, // 特定のサークルIDに関連するメンバーをフィルタリング
      },
      include: {
        user: true, // 関連するユーザー情報を含める
        role: true,
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
      role: member.role, // ロール名を含める
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
        role: member.role,
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
