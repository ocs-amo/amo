import { db } from "@/utils/db"

// イベント生成関数
const createEvent = (
  circleId: string,
  title: string,
  description: string,
  location: string,
  daysAfterToday: number, // 今日から何日後か
  startHour: number, // 開始時間の時刻（24時間制）
  endHour: number, // 終了時間の時刻（24時間制）
  notes: string = "", // 任意の備考
) => {
  // 現在の日付を取得
  const now = new Date()

  // 日付に指定日数を加算
  const activityDay = new Date(now)
  activityDay.setDate(now.getDate() + daysAfterToday)

  // 開始時間を設定
  const startTime = new Date(activityDay)
  startTime.setHours(startHour, 0, 0, 0)

  // 終了時間を設定
  const endTime = new Date(activityDay)
  endTime.setHours(endHour, 0, 0, 0)

  return {
    circleId,
    title,
    description,
    activityDay,
    startTime,
    endTime,
    location,
    notes,
  }
}

// 例：イベントのデータを複数作成
export const circleEvents = () =>
  db.event.createMany({
    data: [
      createEvent(
        "circle00-uuid",
        "ミーティング",
        "定例ミーティングです",
        "404教室",
        3, // 今日から3日後
        15, // 開始時間: 15:00
        18, // 終了時間: 18:00
        "代表は用事のためいません",
      ),
      createEvent(
        "circle00-uuid",
        "勉強会",
        "勉強会",
        "404教室",
        5, // 今日から5日後
        14, // 開始時間: 14:00
        17, // 終了時間: 17:00
      ),
    ],
  })
