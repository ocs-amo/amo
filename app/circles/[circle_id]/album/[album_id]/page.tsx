import { notFound } from "next/navigation"
import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import { auth } from "@/auth"
import { CircleDetailPage } from "@/components/layouts/circle-detail-page"
import { getAlbumById, getAlbums } from "@/data/album"

interface Props {
  params: {
    circle_id?: string
    album_id?: string
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
  const albums = await getAlbums()
  if (!circles || !albums) {
    return []
  }
  return circles.flatMap((circle) =>
    albums.map((album) => ({
      circle_id: circle.id,
      album_id: album.id.toString(),
    })),
  )
}

export const dynamicParams = false
export const dynamic = "force-dynamic"

// ダイナミックルートのページコンポーネント
const Page = async ({ params }: Props) => {
  const { circle_id, album_id: albumId } = params
  const session = await auth()
  const userId = session?.user?.id || ""
  const circle = await getCircleById(circle_id || "")
  const membershipRequests = await getMembershipRequests(
    userId,
    circle_id || "",
  )
  const currentAlbum = await getAlbumById(albumId || "")
  if (!circle || !currentAlbum) {
    notFound()
  }

  return (
    <CircleDetailPage
      circle={circle}
      userId={userId}
      membershipRequests={membershipRequests}
      currentAlbum={currentAlbum}
      tabKey="album"
    />
  )
}

export default Page
