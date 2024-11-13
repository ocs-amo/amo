// utils/db-helpers.ts
import { db } from "@/utils/db"

// メンバーの役職を更新する関数
export const updateMemberRole = async (memberId: number, newRoleId: number) => {
  return await db.circleMember.update({
    where: { id: memberId },
    data: { roleId: newRoleId },
  })
}

// 現在の代表を副代表に降格させる関数
export const demoteCurrentAdmin = async (adminId: number) => {
  return await db.circleMember.update({
    where: { id: adminId },
    data: { roleId: 1 }, // 副代表に降格
  })
}
