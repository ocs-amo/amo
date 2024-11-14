import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"
import { demo } from "@/components/tab/tab-title"
import { getActivities, getActivityById } from "@/data/activity"

interface Props {
  params: {
    circle_id?: string
    activity_id?: string
  }
}

export const generateMetadata = ({ params }: Props) =>
  demo(params.circle_id || "", "活動日程")

/*export const generateMetadata = async ({ params }: Props) => {
  const { circle_id } = params
  const circle = await getCircleById(circle_id || "")

  if (!circle) {
    return {
      title: "サークルが見つかりません。",
      description: "サークルが見つかりません。",
    }
  }

  return {
    title: circle.name,
    description: circle.description,
  }
}*/

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
