import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"

interface Props {
  params: {
    circle_id?: string
    tab_key?: string
  }
}

const handlingTab = (key: string) => {
  switch (key) {
    case "activities":
      return "活動日程"
    case "images":
      return "画像"
    case "notifications":
      return "掲示板"
    case "members":
      return "メンバー一覧"
    default:
      return "活動日程"
  }
}

export const generateMetadata = async ({ params }: Props) => {
  const { circle_id } = params
  const { tab_key } = params

  const circle = await getCircleById(circle_id || "")
  const tab = await handlingTab(tab_key || "")

  if (!circle) {
    return {
      title: "サークルが見つかりません。",
      description: "サークルが見つかりません。",
    }
  }

  return {
    title: tab + " - " + circle.name,
    description: tab + " - " + circle.description,
  }
}

// 固定されたタブキーのリスト
const list = ["activities", "images", "notifications", "members"]

export const dynamicParams = false

// generateStaticParams 関数
export const generateStaticParams = async () => {
  const circles = await getCircles()

  if (!circles) return []

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
  const session = await auth()
  const userId = session?.user?.id || ""
  const circle = await getCircleById(circle_id || "")
  const membershipRequests = await getMembershipRequests(
    userId,
    circle_id || "",
  )

  return (
    <CircleDetailPage
      circle={circle}
      userId={userId}
      membershipRequests={membershipRequests}
      tabKey={tab_key}
    />
  )
}

export default Page
