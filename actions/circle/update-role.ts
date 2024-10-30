"use server"
import { db } from "@/utils/db"

interface ChangeRoleParams {
  userId: string // 権限を変更するユーザーのID
  circleId: string // サークルのID
  targetMemberId: string // 変更対象のメンバーID
  newRoleId: number // 新しい役職ID (0: 代表, 1: 副代表, 3: 一般)
}

// サーバーアクション：権限変更
export const changeMemberRole = async ({
  userId,
  circleId,
  targetMemberId,
  newRoleId,
}: ChangeRoleParams) => {
  try {
    // 1. 現在のユーザーの権限を確認
    const currentUser = await db.circleMember.findFirst({
      where: {
        userId,
        circleId,
        leaveDate: null,
      },
    })

    // 権限確認: 現在のユーザーが存在しない、もしくは役職が未設定の場合エラー
    if (!currentUser || currentUser.roleId === null) {
      throw new Error(
        "操作に必要な権限がありません。サークルのメンバーであること、および役職が設定されていることが必要です。",
      )
    }

    // 2. 自分自身の権限は変更できない
    if (userId === targetMemberId) {
      throw new Error("自分自身の権限を変更することはできません。")
    }

    // 3. 代表または副代表以外は権限変更できない
    if (![0, 1].includes(currentUser.roleId)) {
      throw new Error("この操作を行うための権限が不足しています。")
    }

    // 4. 対象メンバーの情報を取得
    const targetMember = await db.circleMember.findFirst({
      where: {
        userId: targetMemberId,
        circleId,
        leaveDate: null,
      },
    })

    // 対象メンバーが見つからない場合エラー
    if (!targetMember) {
      throw new Error(
        "対象メンバーが見つかりません。対象メンバーがサークルに存在することを確認してください。",
      )
    }

    // 5. 代表のみが他人を代表に昇格できる
    if (newRoleId === 0 && currentUser.roleId !== 0) {
      throw new Error(
        "代表のみが他のメンバーを代表に昇格させることができます。",
      )
    }

    // 6. 他人を代表に昇格させる場合、現在の代表は副代表に降格
    if (newRoleId === 0) {
      await db.circleMember.update({
        where: { id: currentUser.id },
        data: { roleId: 1 }, // 現在の代表を副代表に変更
      })
    }

    // 7. 権限変更の実行
    await db.circleMember.update({
      where: { id: targetMember.id },
      data: { roleId: newRoleId },
    })

    return {
      success: true,
      message: `メンバー ${targetMemberId} の権限を正常に更新しました。`,
    }
  } catch (error) {
    console.error("権限変更エラー:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "不明なエラーが発生しました。",
    }
  }
}
