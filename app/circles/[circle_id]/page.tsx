import { notFound } from "next/navigation"
import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"

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
export const dynamic = "force-dynamic"

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
  const userId = session?.user?.id || ""
  const circle = await getCircleById(circle_id || "")
  if (!circle) {
    notFound()
  }
  const membershipRequests = await getMembershipRequests(
    userId,
    circle_id || "",
  )

  return (
    <CircleDetailPage
      circle={circle}
      userId={userId}
      membershipRequests={membershipRequests}
    />
  )
}

export default Page
