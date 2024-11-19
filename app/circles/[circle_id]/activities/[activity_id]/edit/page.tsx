import { Center } from "@yamada-ui/react"
import { notFound } from "next/navigation"
import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { auth } from "@/auth"
import { ActivityForm } from "@/components/forms/activity-form"
import { getActivities, getActivityById } from "@/data/activity"

interface Props {
  params: {
    circle_id?: string
    activity_id?: string
  }
}

export const generateMetadata = async ({ params }: Props) => {
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
}

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

const Page = async ({ params }: Props) => {
  const { circle_id: circleId, activity_id } = params
  const activityId = !isNaN(parseInt(activity_id || ""))
    ? parseInt(activity_id || "")
    : 0
  const session = await auth()
  const circle = await getCircleById(circleId || "")
  const isMember = circle?.members?.some(
    (member) => member.id === session?.user?.id,
  )
  const activity = await getActivityById(activityId)
  if (!circle || !activity) {
    notFound()
  }
  return isMember && activity.circleId === circleId ? (
    <ActivityForm
      circleId={circleId || ""}
      userId={session?.user?.id || ""}
      circle={circle}
      activity={activity}
      mode="edit"
    />
  ) : (
    <Center w="full" h="full">
      権限がありません
    </Center>
  )
}

export default Page
