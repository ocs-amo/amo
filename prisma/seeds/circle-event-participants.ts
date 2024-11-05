import { db } from "@/utils/db"

export const circleEventParticipants = () =>
  db.eventParticipant.createMany({
    data: [
      {
        eventId: 1,
        userId: "user1-uuid",
      },
      {
        eventId: 2,
        userId: "user2-uuid",
      },
    ],
  })
