import {
  Avatar,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react"
import { notFound } from "next/navigation"
import { getUserById } from "@/actions/user/user"
import { auth } from "@/auth"
import { getUsers } from "@/data/user"
import { MetadataSet } from "@/utils/metadata"

interface Props {
  params: { user_id?: string }
}

export const generateMetadata = ({ params }: Props) =>
  MetadataSet(params.user_id || "", "")

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
  const { user_id } = params
  const session = await auth()
  const user = await getUserById(user_id || "")
  if (!user) {
    notFound()
  }

  return (
    <VStack w="full">
      <HStack>
        <Avatar src={user?.image || ""} boxSize={{ base: "xs", md: "24" }} />
        <VStack>
          <Heading display={{ base: "none", md: "block" }} fontSize="lg">
            {user?.name}
          </Heading>
          <HStack>
            <Text>{user?.studentNumber}</Text>
            {user_id === session?.user?.id ? (
              <Button colorScheme="riverBlue">プロフィール編集</Button>
            ) : undefined}
          </HStack>
        </VStack>
      </HStack>
      <Card>
        <CardBody>
          <Text as="pre" textWrap="wrap">
            {user.profileText}
          </Text>
        </CardBody>
      </Card>
      <Heading as="h3" size="sm">
        所属サークル
      </Heading>
      {/* <Grid
                gridTemplateColumns={
                    user.CircleMember?.length
                        ? {
                            base: "repeat(3, 1fr)",
                            xl: "repeat(2, 1fr)",
                            lg: "repeat(1, 1fr)",
                            md: "repeat(2, 1fr)",
                            sm: "repeat(1, 1fr)",
                        }
                        : undefined
                }
                gap="md"
                w="full"
                h="full"
            >
                {user.CircleMember?.length ? (
                    user.CircleMember?.map((data) => <CircleCard key={data.id} data={data.circle} />)
                ) : (
                    <Center w="full" h="full" as={VStack}>
                        <Text>サークルに入っていません</Text>
                    </Center>
                )}
            </Grid> */}
    </VStack>
  )
}

export default Page
