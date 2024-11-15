import type { AnnouncementFormInput, ThreadFormInput } from "@/schema/topic"
import { db } from "@/utils/db"

export const updateThread = async (data: ThreadFormInput, threadId: string) => {
  return await db.topic.update({
    where: { id: threadId },
    data: {
      title: data.title,
      content: data.content,
    },
  })
}

export const createThread = async (
  data: ThreadFormInput,
  userId: string,
  circleId: string,
) => {
  return await db.topic.create({
    data: {
      title: data.title,
      content: data.content,
      userId,
      circleId,
      type: "thread", // スレッドの種類を指定
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

export const getThreadById = async (topicId: string) =>
  db.topic.findFirst({
    where: {
      id: topicId,
      type: "thread",
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

export const getThreads = async () =>
  db.topic.findMany({
    where: {
      type: "thread",
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

export const getTopics = async () =>
  db.topic.findMany({
    where: {
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
