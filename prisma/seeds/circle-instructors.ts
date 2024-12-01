import { db } from "utils/db"

export const circleInstructors = () =>
  db.circleInstructor.createMany({
    data: [
      {
        circleId: "circle00-uuid",
        userId: "user4-uuid",
      },
      {
        circleId: "circle00-uuid",
        userId: "user5-uuid",
      },
      {
        circleId: "circle01-uuid",
        userId: "user4-uuid",
      },
      {
        circleId: "circle02-uuid",
        userId: "user5-uuid",
      },
    ],
  })
