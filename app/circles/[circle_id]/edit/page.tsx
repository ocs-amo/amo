import type { AutocompleteItem } from "@yamada-ui/react"
import { Center } from "@yamada-ui/react"
import { getCircleById, getCircles } from "@/actions/circle/fetch-circle"
import { auth } from "@/auth"
import { CircleForm } from "@/components/forms/circle-form"
import { demo } from "@/components/tab/tab-title"
import { getInstructors } from "@/data/circle"

interface Props {
  params: { circle_id?: string }
}

export const generateMetadata = ({ params }: Props) =>
  demo(params.circle_id || "", "編集")

export const dynamicParams = false
export const dynamic = "force-dynamic"

export const generateStaticParams = async () => {
  const circles = await getCircles()
  if (!circles) {
    return []
  }

  return circles.map((circle) => ({ circle_id: circle.id }))
}

const Edit = async ({ params }: Props) => {
  const { circle_id } = params
  const session = await auth()
  const circle = await getCircleById(circle_id || "")
  const isAdmin = circle?.members?.some(
    (member) =>
      member.id === session?.user?.id && [0, 1].includes(member.role.id),
  )
  const instructors: AutocompleteItem[] = (await getInstructors()).map(
    (instructor) => ({
      label: instructor.name,
      value: instructor.id,
    }),
  )

  return isAdmin ? (
    <CircleForm
      circle={circle}
      userId={session?.user?.id || ""}
      mode="edit"
      instructors={instructors}
    />
  ) : (
    <Center w="full" h="full">
      権限がありません
    </Center>
  )
}

export default Edit
