import { db } from "utils/db"

export const circleTags = () =>
  db.circleTag.createMany({
    data: [
      {
        circleId: "circle00-uuid",
        tagName: "プログラミング",
      },
      {
        circleId: "circle00-uuid",
        tagName: "パソコン",
      },
      {
        circleId: "circle00-uuid",
        tagName: "アプリ開発",
      },
      {
        circleId: "circle01-uuid",
        tagName: "ゲーム",
      },
      {
        circleId: "circle01-uuid",
        tagName: "Eスポーツ",
      },
    ],
  })
