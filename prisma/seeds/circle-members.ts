import { db } from "@/utils/db"

export const circleMembers = () =>
  db.circleMember.createMany({
    data: [
      {
        userId: "user1-uuid", // 実際のユーザーIDに置き換える
        circleId: "circle00-uuid", // 実際のサークルIDに置き換える
        joinDate: new Date(),
        roleId: 0, // 代表のロールID
      },
      {
        userId: "user2-uuid",
        circleId: "circle00-uuid",
        joinDate: new Date(),
        roleId: 1, // 副代表のロールID
      },
      {
        userId: "user3-uuid",
        circleId: "circle00-uuid",
        joinDate: new Date(),
      },
      // 他のメンバーを追加
    ],
  })
