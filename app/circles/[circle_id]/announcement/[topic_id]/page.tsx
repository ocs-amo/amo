import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"
import { demo } from "@/components/tab/tab-title"
import { getAnnouncementById, getAnnouncements } from "@/data/announcement"

interface Props {
  params: {
    circle_id?: string
    topic_id?: string
  }
}

export const generateMetadata = ({ params }: Props) =>
  demo(params.circle_id || "", "お知らせ")

export const generateStaticParams = async () => {
  const circles = await getCircles()
  const announcements = await getAnnouncements()
  if (!circles || !announcements) {
    return []
  }
  return circles.flatMap((circle) =>
    announcements.map((announcement) => ({
      circle_id: circle.id,
      topic_id: announcement.id.toString(),
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
  const announcementId = topic_id || ""
  const circle = await getCircleById(circle_id || "")
  const membershipRequests = await getMembershipRequests(
    userId,
    circle_id || "",
  )
  const currentAnnouncement = await getAnnouncementById(announcementId)

  return (
    <CircleDetailPage
      circle={circle}
      userId={userId}
      membershipRequests={membershipRequests}
      currentAnnouncement={currentAnnouncement}
      tabKey="notifications"
    />
  )
}

export default Page
