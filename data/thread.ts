import type { ThreadFormInput } from "@/schema/topic"
import { db } from "@/utils/db"

export const deleteThread = async (threadId: string) => {
  return db.topic.update({
    where: {
      id: threadId,
      type: "thread",
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}

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

export const getThreadById = async (topicId: string) => {
  try {
    return db.topic.findFirst({
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
            profileImageUrl: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            topicId: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
    })
  } catch (error) {
    console.error("getThreadById Error: ", error)
    return null
  }
}

export const getThreads = async () => {
  try {
    return db.topic.findMany({
      where: {
        type: "thread",
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("getThreads Error: ", error)
    return null
  }
}

export const getTopics = async (circleId: string) =>
  db.topic.findMany({
    where: {
      circleId,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        },
      },
    },
  })
