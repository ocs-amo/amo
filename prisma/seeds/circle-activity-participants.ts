import { db } from "@/utils/db"

export const circleActivityParticipants = () =>
  db.activityParticipant.createMany({
    data: [
      {
        activityId: 1,
        userId: "user1-uuid",
      },
      {
        activityId: 2,
        userId: "user2-uuid",
      },
    ],
  })
