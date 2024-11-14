import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"
import { demo } from "@/components/tab/tab-title"

interface Props {
  params: { circle_id?: string }
}

export const generateMetadata = ({ params }: Props) =>
  demo(params.circle_id || "", "activities")

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
