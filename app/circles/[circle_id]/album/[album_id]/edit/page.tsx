import { Center } from "@yamada-ui/react"
import { notFound } from "next/navigation"
import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { auth } from "@/auth"
import { AlbumForm } from "@/components/forms/album-form"
import { getAlbumById, getAlbums } from "@/data/album"
import { MetadataSet } from "@/utils/metadata"

interface Props {
  params: {
    circle_id?: string
    album_id?: string
  }
}

export const generateMetadata = ({ params }: Props) =>
  MetadataSet(params.circle_id || "", "アルバム編集")

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

const Page = async ({ params }: Props) => {
  const { circle_id: circleId, album_id: albumId } = params

  const session = await auth()
  const circle = await getCircleById(circleId || "")
  const isMember = circle?.members?.some(
    (member) => member.id === session?.user?.id,
  )
  const album = await getAlbumById(albumId || "")
  if (!circle || !album) {
    notFound()
  }
  return isMember && album.circleId === circleId ? (
    <AlbumForm
      circleId={circleId || ""}
      userId={session?.user?.id || ""}
      mode="edit"
      album={album}
    />
  ) : (
    <Center w="full" h="full">
      権限がありません
    </Center>
  )
}

export default Page
