"use server"
import { db } from "@/utils/db"

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
  })
}
