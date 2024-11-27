import type { AnnouncementFormInput } from "@/schema/topic"
import { db } from "@/utils/db"

export const deleteAnnouncement = async (announcementId: string) => {
  return db.topic.update({
    where: {
      id: announcementId,
      type: "announcement",
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const updateAnnouncement = async (
  data: AnnouncementFormInput,
  announcementId: string,
) => {
  return await db.topic.update({
    where: { id: announcementId },
    data: {
      title: data.title,
      content: data.content,
      isImportant: data.isImportant,
    },
  })
}

export const createAnnouncement = async (
  data: AnnouncementFormInput,
  userId: string,
  circleId: string,
) => {
  return await db.topic.create({
    data: {
      title: data.title,
      content: data.content,
      isImportant: data.isImportant,
      userId,
      circleId,
      type: "announcement", // スレッドの種類を指定
    },
  })
}

export const getAnnouncementById = async (topicId: string) => {
  try {
    return db.topic.findFirst({
      where: {
        id: topicId,
        type: "announcement",
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("getAnnouncementById Error: ", error)
    return null
  }
}

export const getAnnouncementsByUserId = async (userId: string) => {
  try {
    // ユーザーが所属するサークルIDを取得
    const circleIds = await db.circleMember.findMany({
      where: {
        userId: userId,
        leaveDate: null, // 退会していないサークル
      },
      select: {
        circleId: true,
      },
    })

    const circleIdList = circleIds.map((member) => member.circleId)

    if (circleIdList.length === 0) {
      return [] // ユーザーがサークルに所属していない場合
    }

    // サークルのお知らせを取得
    const announcements = await db.topic.findMany({
      where: {
        circleId: {
          in: circleIdList, // ユーザーが所属しているサークルのIDに一致
        },
        deletedAt: null, // 論理削除されていないお知らせ
        type: "announcement",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }, // 作成者情報
        },
      },
      orderBy: {
        createdAt: "desc", // 最新順
      },
    })

    return announcements
  } catch (error) {
    console.error("Error fetching announcements:", error)
    throw new Error("お知らせを取得中にエラーが発生しました。")
  }
}

export const getAnnouncements = async () => {
  try {
    return db.topic.findMany({
      where: {
        type: "announcement",
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("getAnnouncements Error: ", error)
    return null
  }
}
