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
