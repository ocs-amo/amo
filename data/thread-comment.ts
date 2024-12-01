import type { CommentFormInput } from "../schema/topic"
import { db } from "../utils/db"

export const postComment = async (
  userId: string,
  data: CommentFormInput,
  threadId: string,
) =>
  await db.comment.create({
    data: {
      userId,
      content: data.content,
      topicId: threadId,
    },
  })
