import { db } from "@/utils/db"

export const circleMemberRole = () =>
  db.role.createMany({
    data: [
      {
        id: 0,
        roleName: "代表",
      },
      {
        id: 1,
        roleName: "副代表",
      },
    ],
  })
