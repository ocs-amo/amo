import type { AutocompleteItem } from "@yamada-ui/react"
import { Center } from "@yamada-ui/react"
import { auth } from "@/auth"
import { CircleForm } from "@/components/forms/circle-form"
import { getCircleById, getCircles, getInstructors } from "@/data/circle"
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

const Edit = async ({ params }: Props) => {
  const { circle_id } = params
  const session = await auth()
  const circle = await getCircleById(circle_id || "")
  const isAdmin = circle?.members?.some(
    (member) => member.id === session?.user?.id && member.role,
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
