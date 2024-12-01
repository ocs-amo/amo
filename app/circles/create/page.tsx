import type { AutocompleteItem } from "@yamada-ui/react"
import { auth } from "auth"
import { CircleForm } from "components/forms/circle-form"
import { getInstructors } from "data/circle"

export const metadata = {
  title: "サークル作成 - CIRCLIA",
}

const CircleCreate = async () => {
  const session = await auth()
  const instructors: AutocompleteItem[] = (await getInstructors()).map(
    (instructor) => ({
      label: instructor.name,
      value: instructor.id,
    }),
  )

  return (
    <CircleForm
      instructors={instructors}
      userId={session?.user?.id || ""}
      mode="create"
    />
  )
}

export default CircleCreate
