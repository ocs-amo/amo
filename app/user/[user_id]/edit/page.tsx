import { Center, Text } from "@yamada-ui/react"
import { notFound } from "next/navigation"
import { getUserById } from "../../../../actions/user/user"
import { auth } from "../../../../auth"
import { ProfileForm } from "../../../../components/forms/profile-form"
import { getUsers } from "../../../../data/user"

interface Props {
  params: { user_id?: string }
}

export const generateMetadata = async ({ params }: Props) => {
  const user = await getUserById(params.user_id || "")
  if (!user) {
    return {
      title: "ユーザーがいません",
    }
  }
  return {
    title: `${user.name}さん プロフィール編集`,
  }
}

export const dynamicParams = false
export const dynamic = "force-dynamic"

export const generateStaticParams = async () => {
  const users = await getUsers()

  if (!users) {
    return []
  }

  return users.map((user) => ({ user_id: user.id }))
}

const Page = async ({ params }: Props) => {
  const { user_id: userId } = params
  const session = await auth()
  const user = await getUserById(userId || "")
  if (!user) {
    notFound()
  }

  return userId === session?.user?.id ? (
    <ProfileForm user={user} />
  ) : (
    <Center w="full" h="full">
      <Text>権限がありません</Text>
    </Center>
  )
}

export default Page
