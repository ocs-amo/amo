import { Center } from "@yamada-ui/react"
import { notFound } from "next/navigation"
import {
  getCircleById,
  getCircles,
} from "../../../../../../actions/circle/fetch-circle"
import { auth } from "../../../../../../auth"
import { AnnouncementForm } from "../../../../../../components/forms/announcement-form"
import {
  getAnnouncementById,
  getAnnouncements,
} from "../../../../../../data/announcement"
import { MetadataSet } from "../../../../../../utils/metadata"

interface Props {
  params: {
    circle_id?: string
    topic_id?: string
  }
}

export const generateMetadata = ({ params }: Props) =>
  MetadataSet(params.circle_id || "", "お知らせ編集")

export const generateStaticParams = async () => {
  const circles = await getCircles()
  const announcements = await getAnnouncements()
  if (!circles || !announcements) {
    return []
  }
  return circles.flatMap((circle) =>
    announcements.map((announcement) => ({
      circle_id: circle.id,
      topic_id: announcement.id,
    })),
  )
}

export const dynamicParams = false
export const dynamic = "force-dynamic"

const Page = async ({ params }: Props) => {
  const { circle_id: circleId, topic_id: topicId } = params
  const session = await auth()
  const circle = await getCircleById(circleId || "")
  const isMember = circle?.members?.some(
    (member) => member.id === session?.user?.id,
  )
  const announcement = await getAnnouncementById(topicId || "")
  if (!circle || !announcement) {
    notFound()
  }
  return isMember && announcement.circleId === circleId ? (
    <AnnouncementForm
      circleId={circleId || ""}
      userId={session?.user?.id || ""}
      mode="edit"
      announcement={announcement}
    />
  ) : (
    <Center w="full" h="full">
      権限がありません
    </Center>
  )
}

export default Page
