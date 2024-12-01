import { db } from "utils/db"

export const createMembershipRequest = async (
  userId: string,
  circleId: string,
  requestType: "join" | "withdrawal",
) => {
  return await db.membershipRequest.create({
    data: {
      userId,
      circleId,
      requestType,
      status: "pending",
    },
  })
}

export const checkExistingMembershipRequest = async (
  userId: string,
  circleId: string,
  requestType: "join" | "withdrawal",
) => {
  return await db.membershipRequest.findFirst({
    where: {
      circleId,
      userId,
      requestType,
      status: "pending",
    },
  })
}

export const fetchPendingMembershipRequests = async (circleId: string) => {
  return await db.membershipRequest.findMany({
    where: {
      circleId,
      status: "pending", // 保留中の申請
    },
    include: {
      user: true, // 申請者のユーザー情報も取得
    },
    orderBy: {
      requestType: "asc",
    },
  })
}

// メンバー申請の承認
export const approveMembershipRequest = async (
  requestId: string,
  adminId: string,
) => {
  return await db.membershipRequest.update({
    where: { id: requestId },
    data: {
      status: "approved", // ステータスを'approved'に更新
      resolvedDate: new Date(), // 承認日を現在の日付に設定
      processedBy: adminId, // 処理した管理者のIDを保存
    },
  })
}

// メンバー申請の拒否
export const rejectMembershipRequest = async (
  requestId: string,
  adminId: string,
) => {
  return await db.membershipRequest.update({
    where: { id: requestId },
    data: {
      status: "rejected", // ステータスを'rejected'に更新
      resolvedDate: new Date(), // 拒否日を現在の日付に設定
      processedBy: adminId, // 処理した管理者のIDを保存
    },
  })
}
