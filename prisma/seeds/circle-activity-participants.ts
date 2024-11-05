import { db } from "@/utils/db"

export const circleActivityParticipants = () =>
  db.activityParticipant.createMany({
    data: [
      {
        activitytId: 1,
        userId: "user1-uuid",
      },
      {
        activitytId: 2,
        userId: "user2-uuid",
      },
    ],
  })
