import {
  checkExistingMembershipRequest,
  createMembershipRequest,
} from "@/data/membership"

export const handleMembershipRequest = async (
  userId: string,
  circleId: string,
  requestType: "join" | "withdrawal",
) => {
  try {
    const existingRequest = await checkExistingMembershipRequest(
      userId,
      circleId,
      requestType,
    )

    if (existingRequest) {
      return { success: false, message: "すでに保留中の申請があります。" }
    }

    await createMembershipRequest(userId, circleId, requestType)

    return { success: true, message: "申請が成功しました。" }
  } catch (error) {
    console.error(error)
    return { success: false, message: "申請中にエラーが発生しました。" }
  }
}
