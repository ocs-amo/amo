import { CircleDetailPage } from "../page"
import { getCircleById, getCircles, getMemberByCircleId } from "@/data/circle"

interface Props {
  params: {
    circle_id?: string
    tab_key?: string
  }
}

// 固定されたタブキーのリスト
const list = ["days", "images", "notifications", "members"]

export const dynamicParams = false

// generateStaticParams 関数
export const generateStaticParams = async () => {
  const circles = await getCircles()

  // 各サークルのIDとタブキーの組み合わせを生成
  return circles?.flatMap((circle) =>
    list.map((tab_key) => ({
      circle_id: circle.id,
      tab_key: tab_key,
    })),
  )
}

// ダイナミックルートのページコンポーネント
const Page = async ({ params }: Props) => {
  const { circle_id, tab_key } = params

  const circle = await getCircleById(circle_id || "")
  const members = await getMemberByCircleId(circle_id || "")

  return <CircleDetailPage circle={circle} members={members} tabKey={tab_key} />
}

export default Page