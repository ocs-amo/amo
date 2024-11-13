import { Center } from "@yamada-ui/react"
import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { auth } from "@/auth"
import { ActivityForm } from "@/components/forms/activity-form"

interface Props {
  params: { circle_id?: string }
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
  if (!circles) {
    return []
  }
  return circles.map((circle) => ({ circle_id: circle.id }))
}

export const dynamicParams = false

const Page = async ({ params }: Props) => {
  const { circle_id: circleId } = params
  const session = await auth()
  const circle = await getCircleById(circleId || "")
  const isMember = circle?.members?.some(
    (member) => member.id === session?.user?.id,
  )
  return isMember ? (
    <ActivityForm
      circleId={circleId || ""}
      userId={session?.user?.id || ""}
      circle={circle}
      mode="create"
    />
  ) : (
    <Center w="full" h="full">
      権限がありません
    </Center>
  )
}

export default Page
