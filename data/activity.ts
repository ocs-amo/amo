import type { ActivityFormType } from "@/schema/activity"
import { db } from "@/utils/db"

// 指定された月のイベントを取得する関数
export const getActivitiesByMonth = async (year: number, month: number) => {
  // 月の開始日と終了日を取得
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  // イベントの取得
  return await db.activity.findMany({
    where: {
      activityDay: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      startTime: "asc",
    },
  })
}

// 活動日を作成するための関数
export const createActivity = async (
  data: ActivityFormType,
  circleId: string,
  userId: string,
) => {
  return await db.activity.create({
    data: {
      circleId,
      title: data.title,
      description: data.description || "", // 空文字のデフォルト
      activityDay: data.date,
      location: data.location || "",
      startTime: new Date(
        `${data.date.toISOString().split("T")[0]}T${data.startTime}`,
      ),
      endTime: data.endTime
        ? new Date(`${data.date.toISOString().split("T")[0]}T${data.endTime}`)
        : null,
      notes: data.notes || "",
      createdBy: userId, // 作成者情報などが必要なら追加
    },
  })
}
