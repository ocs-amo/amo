import { Center } from "@yamada-ui/react"
import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { auth } from "@/auth"
import { ThreadForm } from "@/components/forms/thread-form"
import { getThreadById, getThreads } from "@/data/thread"

interface Props {
  params: {
    circle_id?: string
    topic_id?: string
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
  const threads = await getThreads()
  if (!circles || !threads) {
    return []
  }
  return circles.flatMap((circle) =>
    threads.map((thread) => ({
      circle_id: circle.id,
      topic_id: thread.id,
    })),
  )
}

export const dynamicParams = false

const Page = async ({ params }: Props) => {
  const { circle_id: circleId, topic_id: topicId } = params
  const session = await auth()
  const circle = await getCircleById(circleId || "")
  const isMember = circle?.members?.some(
    (member) => member.id === session?.user?.id,
  )
  const thread = await getThreadById(topicId || "")
  return isMember ? (
    <ThreadForm
      circleId={circleId || ""}
      userId={session?.user?.id || ""}
      mode="edit"
      thread={thread}
    />
  ) : (
    <Center w="full" h="full">
      権限がありません
    </Center>
  )
}

export default Page
