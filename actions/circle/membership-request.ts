"use server"
import {
  addMemberToCircle,
  isUserAdmin,
  removeMemberFromCircle,
} from "@/data/circle"
import {
  approveMembershipRequest,
  checkExistingMembershipRequest,
  createMembershipRequest,
  fetchPendingMembershipRequests,
  rejectMembershipRequest,
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

export const handleMembershipRequestAction = async (
  adminUserId: string, // サークルの管理者（アクションを行うユーザー）
  circleId: string,
  requestId: string,
  requestType: "join" | "withdrawal",
  action: "approve" | "reject",
) => {
  try {
    // ユーザーがサークルの管理者かどうかを確認
    const isAdmin = await isUserAdmin(adminUserId, circleId)

    if (!isAdmin) {
      return { success: false, message: "サークルの管理者ではありません。" }
    }

    // 承認または拒否処理
    if (action === "approve") {
      // 承認と共に対象となるユーザーID（申請者のID）を取得
      const { userId: targetUserId } = await approveMembershipRequest(
        requestId,
        adminUserId,
      )

      // リクエストタイプに応じて入会/退会処理を行う
      if (requestType === "join") {
        await addMemberToCircle(targetUserId, circleId) // 対象ユーザーをメンバーに追加
        return {
          success: true,
          message: "入会申請を承認しました。メンバーに追加しました。",
        }
      } else {
        await removeMemberFromCircle(targetUserId, circleId) // 対象ユーザーを退会
        return {
          success: true,
          message: "退会申請を承認しました。メンバーリストから削除しました。",
        }
      }
    } else if (action === "reject") {
      await rejectMembershipRequest(requestId, adminUserId)
      return { success: true, message: "申請を拒否しました。" }
    } else {
      return { success: false, message: "無効なアクションです。" }
    }
  } catch (error) {
    console.error("申請処理中にエラーが発生しました:", error)
    return { success: false, message: "申請処理中にエラーが発生しました。" }
  }
}
