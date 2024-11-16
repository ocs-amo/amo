import type { AnnouncementFormInput } from "@/schema/topic"
import { db } from "@/utils/db"

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
