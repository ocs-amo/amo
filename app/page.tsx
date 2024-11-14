import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  InfoIcon,
  ScrollArea,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { getCirclesByUserId } from "@/actions/circle/fetch-circle"
import { getUserById } from "@/actions/user/user"
import { auth } from "@/auth"
import { CircleCard } from "@/components/data-display/circle-card"

export const metadata = {
  title: "ホーム - CIRCLIA",
}

const notificationMockData = [
  {
    id: 1,
    icon: "https://i.pravatar.cc/100",
    title: "今月からの新メンバー",
    createdAt: "2024-06-02 9:00",
    type: "alert",
  },
  {
    id: 2,
    icon: "https://picsum.photos/seed/picsum/100/100",
    title: "やってみたいこと募集",
    createdAt: "2024-06-02 9:00",
    type: "",
  },
]

const calendarMockData = [
  { date: "2", events: [] },
  { date: "3", events: [{ title: "ゲームサークル" }] },
  { date: "4", events: [] },
  { date: "5", events: [] },
  { date: "6", events: [{ title: "プログラミングサークル" }] },
  { date: "7", events: [] },
  { date: "8", events: [] },
]

export default async function Home() {
  const session = await auth()
  const user = await getUserById(session?.user?.id || "")
  const circles = await getCirclesByUserId(user?.id || "")
  return (
    <VStack w="full" h="fit-content" p="md">
      <VStack>
        <Heading as="h2" size="lg">
          ようこそ！
        </Heading>
        <Divider
          w="full"
          borderWidth="2px"
          orientation="horizontal"
          variant="solid"
        />
        <Heading as="h2" size="lg">
          {user?.studentNumber}
          {` `}
          {user?.name}
        </Heading>
      </VStack>
      <Grid
        w="full"
        flexGrow={1}
        templateAreas={{
          base: `
        "notification circles circles circles" 
        "notification circles circles circles" 
        "notification calendar calendar calendar" 
        "notification calendar calendar calendar" 
        `,
          md: `
        "notification"
        "circles"
        "calendar"
        `,
        }}
        gap="lg"
      >
        <GridItem
          as={Card}
          area="notification"
          minW={{ base: "md", sm: "full" }}
        >
          <CardHeader>
            <Heading as="h3" size="sm">
              お知らせ
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack overflowY="auto" gap="md">
              {notificationMockData.map((data) => (
                <HStack key={data.id} p="sm" borderWidth={1}>
                  <Box>
                    <Image src={data.icon} w="full" alt="icon image" />
                  </Box>
                  <VStack>
                    <HStack gap="sm">
                      {data.type === "alert" ? (
                        <InfoIcon fontSize="lg" color="primary" />
                      ) : undefined}
                      <Heading size="xs" as="h4">
                        {data.title}
                      </Heading>
                    </HStack>
                    <Flex justifyContent="right">{data.createdAt}</Flex>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </GridItem>
        <GridItem as={Card} area="circles">
          <CardHeader>
            <Heading as="h3" size="sm">
              所属サークル
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid
              gridTemplateColumns={
                circles?.length
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
            >
              {circles?.length ? (
                circles?.map((data) => <CircleCard key={data.id} data={data} />)
              ) : (
                <Center w="full" as={VStack}>
                  <Text>サークルに入っていません</Text>
                  <Button as={Link} href="/circles">
                    サークルを探す
                  </Button>
                </Center>
              )}
            </Grid>
          </CardBody>
        </GridItem>
        <GridItem as={Card} area="calendar" w="full" overflowX="auto">
          <CardHeader>
            <Heading as="h3" size="sm">
              カレンダー
            </Heading>
          </CardHeader>
          <CardBody>
            <ScrollArea w="full" borderWidth={1}>
              <HStack w="full" gap={0}>
                {calendarMockData.map((data, index) => (
                  <VStack
                    key={index}
                    h="full"
                    flex={1}
                    borderRightWidth={
                      index < calendarMockData.length - 1 ? 1 : 0
                    }
                    p="md"
                    minW="2xs"
                  >
                    <Box>{data.date}</Box>
                    <VStack h="sm" overflowY="auto">
                      {data.events.map((event, i) => (
                        <Tag key={i}>{event.title}</Tag>
                      ))}
                    </VStack>
                  </VStack>
                ))}
              </HStack>
            </ScrollArea>
          </CardBody>
        </GridItem>
      </Grid>
    </VStack>
  )
}
