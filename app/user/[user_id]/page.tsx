import {
  Avatar,
  Button,
  Card,
  CardBody,
  Center,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCirclesByUserId } from "@/actions/circle/fetch-circle"
import { getUserById } from "@/actions/user/user"
import { auth } from "@/auth"
import { CircleCard } from "@/components/data-display/circle-card"
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
  const { user_id: userId } = params
  const session = await auth()
  const user = await getUserById(userId || "")
  const circles = await getCirclesByUserId(userId || "")
  if (!user) {
    notFound()
  }

  return (
    <VStack w="full" h="full" p="md">
      <HStack
        w="full"
        maxW="3xl"
        m="auto"
        flexDir={{ base: "row", sm: "column" }}
      >
        <Avatar src={user?.image || ""} boxSize={{ base: "2xs", md: "24" }} />
        <VStack maxW="xl">
          <Heading fontSize="2xl">{user?.name}</Heading>
          <HStack justifyContent="space-between" flexWrap="wrap">
            <Text>{user?.studentNumber}</Text>
            {userId === session?.user?.id ? (
              <Button colorScheme="riverBlue">プロフィール編集</Button>
            ) : undefined}
          </HStack>
        </VStack>
      </HStack>
      {user.profileText ? (
        <Card>
          <CardBody>
            <Text as="pre" textWrap="wrap">
              {user.profileText}
            </Text>
          </CardBody>
        </Card>
      ) : undefined}
      <Heading as="h3" size="sm">
        所属サークル
      </Heading>
      <Grid
        gridTemplateColumns={
          circles?.length
            ? {
                base: "repeat(5, 1fr)",
                xl: "repeat(4, 1fr)",
                lg: "repeat(3, 1fr)",
                md: "repeat(2, 1fr)",
                sm: "repeat(1, 1fr)",
              }
            : undefined
        }
        gap="md"
        w="full"
        h="full"
      >
        {circles?.length ? (
          circles?.map((data) => <CircleCard key={data.id} data={data} />)
        ) : (
          <Center w="full" h="full" as={VStack}>
            <Text>サークルに入っていません</Text>
            {userId === session?.user?.id ? (
              <Button as={Link} href="/circles">
                サークルを探す
              </Button>
            ) : undefined}
          </Center>
        )}
      </Grid>
    </VStack>
  )
}

export default Page
