import { getMembershipRequests } from "@/actions/circle/membership-request"
import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"
import { getCircleById, getCircles } from "@/data/circle"

interface Props {
  params: {
    circle_id?: string
    tab_key?: string
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
