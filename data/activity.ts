import type { ActivityFormType } from "@/schema/activity"
import { db } from "@/utils/db"

// 指定された月のイベントを取得する関数
export const getActivitiesByMonth = async (year: number, month: number) => {
  // 月の開始日と終了日を取得
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  // イベントの取得（参加者一覧を含む）
  return await db.activity.findMany({
    where: {
      activityDay: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      participants: {
        include: {
          user: true, // `ActivityParticipant`がユーザー情報を持つ場合、参加者のユーザー情報も取得
        },
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
  createdBy: string,
) => {
  // トランザクションでアクティビティ作成と参加者追加をまとめる
  return await db.$transaction(async (tx) => {
    // アクティビティの作成
    const newActivity = await tx.activity.create({
      data: {
        title: data.title,
        description: data.description || "", // オプションフィールドに空文字を設定
        activityDay: data.date,
        startTime: new Date(
          `${data.date.toISOString().split("T")[0]}T${data.startTime}`,
        ),
        endTime: data.endTime
          ? new Date(`${data.date.toISOString().split("T")[0]}T${data.endTime}`)
          : null,
        location: data.location || "",
        notes: data.notes,
        circleId: circleId,
        createdBy: createdBy,
      },
    })

    // サークルのメンバーを取得
    const members = await tx.circleMember.findMany({
      where: { circleId, leaveDate: null },
      select: { userId: true }, // ユーザーIDのみ取得
    })

    // サークルメンバーを参加者テーブルに一括登録
    const participants = members.map((member) => ({
      activityId: newActivity.id,
      userId: member.userId,
    }))

    await tx.activityParticipant.createMany({
      data: participants,
    })

    return newActivity
  })
}
