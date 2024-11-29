"use server"

import { auth } from "@/auth"
import { getActivitiesByDateRange } from "@/data/activity"

// サーバーアクション：指定週のイベントを取得
export const fetchActivitiesByWeek = async (date: Date, circleId: string) => {
  try {
    // 認証情報を取得
    const session = await auth()

    // 認証されたユーザーIDとリクエストのuserIdが一致しているか確認
    if (!session?.user) {
      return {
        success: false,
        message: "権限がありません。",
      }
    }

    // 指定された日付から週の開始日と終了日を計算
    const dayOfWeek = date.getDay() // 0 (日曜日) から 6 (土曜日)
    const startDate = new Date(date) // 週の開始日
    startDate.setDate(date.getDate() - dayOfWeek + 1) // 月曜日を週の開始日とする場合
    startDate.setHours(0, 0, 0, 0) // 時間をリセット

    const endDate = new Date(startDate) // 週の終了日
    endDate.setDate(startDate.getDate() + 6) // 6日後は日曜日
    endDate.setHours(23, 59, 59, 999) // 終了時間を設定

    // 指定された期間内のイベントを取得
    const events = await getActivitiesByDateRange(startDate, endDate, circleId)

    return {
      success: true,
      events,
    }
  } catch (error) {
    console.error("イベント取得エラー:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "不明なエラーが発生しました。",
    }
  }
}
