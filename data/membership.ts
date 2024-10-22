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
