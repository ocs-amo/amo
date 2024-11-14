import type { ThreadFormInput } from "@/schema/topic"
import { db } from "@/utils/db"

export const createThread = async (
  data: ThreadFormInput,
  userId: string,
  circleId: string,
) => {
  return await db.topic.create({
    data: {
      title: data.title,
      content: data.content,
      createdBy: userId,
      circleId,
      type: "thread", // スレッドの種類を指定
    },
  })
}
