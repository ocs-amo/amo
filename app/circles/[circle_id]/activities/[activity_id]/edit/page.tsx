import { Center } from "@yamada-ui/react"
import { getCircleById } from "@/actions/circle/fetch-circle"
import { auth } from "@/auth"
import { ActivityForm } from "@/components/forms/activity-form"
import { getActivityById } from "@/data/activity"

interface Props {
  params: {
    circle_id?: string
    activity_id?: string
  }
}

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
  return isMember ? (
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
