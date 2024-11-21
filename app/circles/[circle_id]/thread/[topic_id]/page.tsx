import { notFound } from "next/navigation"
import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"
import { MetadataSet } from "@/utils/metadata"
import { getThreadById, getThreads } from "@/data/thread"

interface Props {
  params: {
    circle_id?: string
    topic_id?: string
  }
}

export const generateMetadata = ({ params }: Props) =>
  MetadataSet(params.circle_id || "", "スレッド")

export const generateStaticParams = async () => {
  const circles = await getCircles()
  const threads = await getThreads()
  if (!circles || !threads) {
    return []
  }
  return circles.flatMap((circle) =>
    threads.map((thread) => ({
      circle_id: circle.id,
      topic_id: thread.id.toString(),
    })),
  )
}

export const dynamicParams = false
export const dynamic = "force-dynamic"

// ダイナミックルートのページコンポーネント
const Page = async ({ params }: Props) => {
  const { circle_id, topic_id } = params
  const session = await auth()
  const userId = session?.user?.id || ""
  const threadId = topic_id || ""
  const circle = await getCircleById(circle_id || "")
  const membershipRequests = await getMembershipRequests(
    userId,
    circle_id || "",
  )
  const currentThread = await getThreadById(threadId)
  if (!circle || !currentThread || currentThread.circleId !== circle_id) {
    notFound()
  }
  return (
    <CircleDetailPage
      circle={circle}
      userId={userId}
      membershipRequests={membershipRequests}
      currentThread={currentThread}
      tabKey="notifications"
    />
  )
}

export default Page
