"use server"
import { isUserAdmin } from "@/data/circle"
import {
  checkExistingMembershipRequest,
  createMembershipRequest,
  fetchPendingMembershipRequests,
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

export const checkPendingRequest = async (
  userId: string,
  circleId: string,
  requestType: "join" | "withdrawal",
) => {
  try {
    // 既存の保留中のリクエストがあるか確認
    const existingRequest = await checkExistingMembershipRequest(
      userId,
      circleId,
      requestType,
    )

    // 申請が存在する場合は true を返す
    return !!existingRequest
  } catch (error) {
    console.error("リクエスト確認中にエラーが発生しました:", error)
    return false // エラー時は false を返す（申請がないとみなす）
  }
}

// サークルの申請リストを取得する関数
export const getMembershipRequests = async (
  userId: string,
  circleId: string,
) => {
  try {
    // ユーザーがサークルの管理者かどうかを確認
    const isAdmin = await isUserAdmin(userId, circleId)

    // 管理者でなければエラーメッセージを返す
    if (!isAdmin) {
      return { success: false, message: "サークルの管理者ではありません。" }
    }

    // 保留中の申請を取得
    const requests = await fetchPendingMembershipRequests(circleId)

    // 申請データを整形して返す
    const formattedRequests = requests.map((request) => ({
      id: request.id,
      userId: request.userId,
      userName: request.user.name,
      iconImagePath: request.user.iconImagePath,
      studentNumber: request.user.studentNumber,
      requestType: request.requestType,
      requestDate: request.requestDate,
    }))

    return { success: true, data: formattedRequests }
  } catch (error) {
    console.error("申請リストの取得中にエラーが発生しました:", error)
    return {
      success: false,
      message: "申請リストの取得中にエラーが発生しました。",
    }
  }
}
