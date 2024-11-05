import { db } from "@/utils/db"

// 指定された月のイベントを取得する関数
export const getEventsByMonth = async (year: number, month: number) => {
  // 月の開始日と終了日を取得
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  // イベントの取得
  return await db.event.findMany({
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
