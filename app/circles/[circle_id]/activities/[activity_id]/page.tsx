import { notFound } from "next/navigation"
import {
  getCircleById,
  getCircles,
} from "../../../../../actions/circle/fetch-circle"
import { getMembershipRequests } from "../../../../../actions/circle/membership-request"
import { auth } from "../../../../../auth"
import { CircleDetailPage } from "../../../../../components/layouts/circle-detail-page"
import { getActivities, getActivityById } from "../../../../../data/activity"
import { MetadataSet } from "../../../../../utils/metadata"

interface Props {
  params: {
    circle_id?: string
    activity_id?: string
  }
}

export const generateMetadata = ({ params }: Props) =>
  MetadataSet(params.circle_id || "", "活動日程")

export const generateStaticParams = async () => {
  const circles = await getCircles()
  const activities = await getActivities()
  if (!circles || !activities) {
    return []
  }
  return circles.flatMap((circle) =>
    activities.map((activity) => ({
      circle_id: circle.id,
      activity_id: activity.id.toString(),
    })),
  )
}

export const dynamicParams = false
export const dynamic = "force-dynamic"

// ダイナミックルートのページコンポーネント
const Page = async ({ params }: Props) => {
  const { circle_id, activity_id } = params
  const session = await auth()
  const userId = session?.user?.id || ""
  const activityId = !isNaN(parseInt(activity_id || ""))
    ? parseInt(activity_id || "")
    : 0
  const circle = await getCircleById(circle_id || "")
  const membershipRequests = await getMembershipRequests(
    userId,
    circle_id || "",
  )
  const currentActivity = await getActivityById(activityId)
  if (!circle || !currentActivity || currentActivity.circleId !== circle_id) {
    notFound()
  }

  return (
    <CircleDetailPage
      circle={circle}
      userId={userId}
      membershipRequests={membershipRequests}
      currentActivity={currentActivity}
    />
  )
}

export default Page
