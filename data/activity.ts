import type { ActivityFormType } from "@/schema/activity"
import { db } from "@/utils/db"

export const getActivityById = async (activityId: number) => {
  return await db.activity.findFirst({
    where: {
      id: activityId,
    },
    include: {
      participants: {
        include: {
          user: true, // `ActivityParticipant`がユーザー情報を持つ場合、参加者のユーザー情報も取得
        },
        where: {
          removedAt: null,
        },
      },
    },
  })
}

export const getActivities = async () => {
  try {
    return await db.activity.findMany({
      where: {
        deletedAt: null,
      },
    })
  } catch (error) {
    console.error("getActivities: ", error)
    return null
  }
}

// 指定された月のイベントを取得する関数
export const getActivitiesByMonth = async (
  year: number,
  month: number,
  circleId: string,
) => {
  // 月の開始日と終了日を取得
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  // イベントの取得（参加者一覧を含む）
  return await db.activity.findMany({
    where: {
      circleId,
      activityDay: {
        gte: startDate,
        lte: endDate,
      },
      deletedAt: null,
    },
    include: {
      participants: {
        include: {
          user: true, // `ActivityParticipant`がユーザー情報を持つ場合、参加者のユーザー情報も取得
        },
        where: {
          removedAt: null,
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

export const updateActivity = async (
  data: ActivityFormType,
  activityId: number,
) => {
  return await db.activity.update({
    where: { id: activityId },
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      activityDay: data.date,
      startTime: new Date(
        `${data.date.toISOString().split("T")[0]}T${data.startTime}`,
      ),
      endTime: data.endTime
        ? new Date(`${data.date.toISOString().split("T")[0]}T${data.endTime}`)
        : null,
      notes: data.notes,
    },
  })
}

// アクティビティへの参加・キャンセルのトグル処理
export const updateActivityParticipation = async (
  activityId: number,
  userId: string,
) => {
  // 現在参加中のレコードを確認（removedAtがnullのもののみ）
  const existingParticipant = await db.activityParticipant.findFirst({
    where: {
      activityId,
      userId,
      removedAt: null,
    },
  })

  if (existingParticipant) {
    // 参加中のレコードが存在する場合、キャンセル（removedAtに日付をセット）
    await db.activityParticipant.update({
      where: { id: existingParticipant.id },
      data: { removedAt: new Date() },
    })
    return { action: "canceled" } // キャンセル完了
  } else {
    // 参加中のレコードがない場合、新しい参加レコードを作成
    await db.activityParticipant.create({
      data: {
        activityId,
        userId,
        joinedAt: new Date(),
        removedAt: null, // 新規参加時はremovedAtはnull
      },
    })
    return { action: "joined" } // 新規参加完了
  }
}

export const deleteActivity = async (activityId: number) => {
  return await db.activity.update({
    where: { id: activityId },
    data: {
      deletedAt: new Date(),
    },
  })
}
