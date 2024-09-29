import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  InfoIcon,
  Text,
  VStack,
} from "@yamada-ui/react"

const notificationMockData = [
  {
    id: 1,
    icon: "https://i.pravatar.cc/100",
    title: "天文サークルが新たに作成されました！",
    createdAt: "1分前",
    type: "alert",
    description: "",
  },
  {
    id: 2,
    icon: "https://picsum.photos/seed/picsum/100/100",
    title: "プログラミングサークル",
    createdAt: "4時間前",
    type: "",
    description: "6/7 16:00～",
  },
  {
    id: 3,
    icon: "https://picsum.photos/seed/picsum/100/100",
    title: "料理サークル",
    createdAt: "2日前",
    type: "",
    description: "7/3 16:00 ロビー集合",
  },
]

const NotificationsPage = () => {
  return (
    <VStack w="full" h="fit-content" p="md">
      <VStack>
        <Heading as="h2" size="lg">
          新着情報
        </Heading>
        <Divider
          w="full"
          borderWidth="2px"
          orientation="horizontal"
          variant="solid"
        />
      </VStack>
      {notificationMockData.map((data) => (
        <HStack
          key={data.id}
          w="full"
          flexDir={{ sm: "column" }}
          gap={{ sm: "sm", base: "md" }}
        >
          <HStack flexGrow={1} p="sm" borderWidth={1} w="full">
            <Box>
              <Image src={data.icon} w="full" alt="icon image" />
            </Box>
            <VStack>
              <HStack gap="sm">
                {data.type === "alert" ? (
                  <InfoIcon size="lg" color="primary" />
                ) : undefined}
                <Heading size="xs" as="h4">
                  {data.title}
                </Heading>
              </HStack>
              <Text fontSize="sm">{data.description}</Text>
            </VStack>
          </HStack>
          <Flex
            w={{ base: "20", sm: "full" }}
            justifyContent={{ base: "left", sm: "right" }}
          >
            {data.createdAt}
          </Flex>
        </HStack>
      ))}
    </VStack>
  )
}

export default NotificationsPage
