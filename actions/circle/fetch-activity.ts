"use server"

import { getActivitiesByMonth } from "@/data/activity"

// サーバーアクション：指定月のイベントを取得
export const fetchActivitiesByMonth = async (date: Date, circleId: string) => {
  try {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 月は1月が0から始まるため+1

    const events = await getActivitiesByMonth(year, month, circleId)

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
