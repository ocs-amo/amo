import {
  Avatar,
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

const generateCalendarData = () => {
  const today = new Date()
  const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}`
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`
    return {
      date: formattedDate,
      isToday: formattedDate === todayFormatted,
      events: i % 1 === 0 ? [{ title: `イベント${i + 1}` }] : [],
    }
  })
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

export default async function Home() {
  const session = await auth()
  const user = await getUserById(session?.user?.id || "")
  const circles = await getCirclesByUserId(user?.id || "")
  const calendarData = generateCalendarData()
  // const weekcalendar =  ActivitiesByDateRange()

  return (
    <VStack w="full" h="fit-content" p="md">
      <VStack>
        <Heading as="h2" size="lg">
          ようこそ！
          <Text display={{ base: "inline", md: "none" }}>
            {` `}
            {user?.studentNumber}
            {` `}
            {user?.name}
          </Text>
        </Heading>
        <Divider
          w="full"
          borderWidth="2px"
          orientation="horizontal"
          variant="solid"
          borderColor="black"
        />
      </VStack>
      <Grid
        w="full"
        flexGrow={1}
        templateAreas={{
          base: `
        "avatar circles circles circles" 
        "avatar circles circles circles" 
        "notification calendar calendar calendar" 
        "notification calendar calendar calendar" 
        `,
          md: `
        "avatar"
        "notification"
        "circles"
        "calendar"
        `,
        }}
        gap="lg"
      >
        <GridItem
          area="avatar"
          as={Center}
          w="full"
          justifyContent="space-evenly"
        >
          <Avatar
            as={Link}
            href={`/user/${user?.id}`}
            src={user?.image || ""}
            boxSize={{ base: "xs", md: "24" }}
            title="プロフィールへ移動"
          />
          <Heading display={{ base: "none", md: "block" }} fontSize="lg">
            <Text>{user?.studentNumber}</Text>
            <Text>{user?.name}</Text>
          </Heading>
        </GridItem>
        <GridItem
          as={Card}
          variant="unstyled"
          area="notification"
          minW={{ base: "md", sm: "full" }}
        >
          <CardHeader>
            <Heading as="h3" size="sm">
              お知らせ
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack w="full" h="full" overflowY="auto" gap="md">
              {notificationMockData.map((data) => (
                <HStack key={data.id} p="sm" bg="white" as={Card}>
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
        <GridItem as={Card} variant="unstyled" area="circles">
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
              h="full"
            >
              {circles?.length ? (
                circles?.map((data) => <CircleCard key={data.id} data={data} />)
              ) : (
                <Center w="full" h="full" as={VStack}>
                  <Text>サークルに入っていません</Text>
                  <Button as={Link} href="/circles">
                    サークルを探す
                  </Button>
                </Center>
              )}
            </Grid>
          </CardBody>
        </GridItem>
        <GridItem
          as={Card}
          variant="unstyled"
          area="calendar"
          w="full"
          overflowX="auto"
        >
          <CardHeader>
            <HStack justifyContent="space-between">
              <Heading as="h3" size="sm">
                カレンダー
              </Heading>
              <Button>前の週</Button>
              <Button>次の週</Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <ScrollArea w="full" h="full" mb="md" as={Card}>
              <HStack w="full" h="full" gap={0}>
                {calendarData.map((data, index) => (
                  <VStack
                    key={index}
                    h="full"
                    flex={1}
                    borderRightWidth={index < calendarData.length - 1 ? 1 : 0}
                    p="md"
                    minW="2xs"
                    bg="white"
                  >
                    <Box
                      fontWeight={data.isToday ? 900 : "normal"}
                      fontSize={data.isToday ? "lg" : "md"}
                    >
                      {data.date}
                    </Box>
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
