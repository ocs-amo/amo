import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"
import { getCircleById, getCircles } from "@/data/circle"

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
export const dynamicParams = false

export const generateStaticParams = async () => {
  const circles = await getCircles()

  if (!circles) {
    return []
  }

  return circles.map((circle) => ({ circle_id: circle.id }))
}

const Page = async ({ params }: Props) => {
  const { circle_id } = params
  const session = await auth()
  const circle = await getCircleById(circle_id || "")

  return <CircleDetailPage circle={circle} userId={session?.user?.id || ""} />
}

export default Page
