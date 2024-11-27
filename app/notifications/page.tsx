import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  InfoIcon,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from "@yamada-ui/react"
import { auth } from "@/auth"
import { getAnnouncementsByUserId } from "@/data/announcement"
import { parseDate } from "@/utils/format"

export const metadata = {
  title: "通知 - CIRCLIA",
}

const NotificationsPage = async () => {
  const session = await auth()
  const announcements = await getAnnouncementsByUserId(session?.user?.id || "")

  return (
    <VStack w="full" h="full" p="md">
      <VStack>
        <Heading as="h2" size="lg">
          お知らせ
        </Heading>
        <Divider
          w="full"
          borderWidth="2px"
          orientation="horizontal"
          variant="solid"
        />
      </VStack>
      {announcements.length ? (
        announcements?.map((announcement) => (
          <HStack
            key={announcement.id}
            w="full"
            flexDir={{ sm: "column" }}
            gap={{ sm: "sm", base: "md" }}
          >
            <HStack
              flexGrow={1}
              p="sm"
              borderWidth={1}
              as={LinkBox}
              bg="white"
              w="full"
            >
              <Box>
                <Avatar
                  src={announcement.user.image || ""}
                  alt={`${announcement.user.name}のアイコン画像`}
                />
              </Box>
              <VStack
                as={LinkOverlay}
                href={`/circles/${announcement.circleId}/announcement/${announcement.id}`}
              >
                <HStack gap="sm">
                  {announcement.isImportant ? (
                    <InfoIcon fontSize="lg" color="primary" />
                  ) : undefined}
                  <Heading size="xs" as="h4">
                    {announcement.title}
                  </Heading>
                </HStack>
                <Text fontSize="sm" as="pre">
                  {announcement.content}
                </Text>
              </VStack>
            </HStack>
            <Flex
              w={{ base: "20", sm: "full" }}
              justifyContent={{ base: "left", sm: "right" }}
            >
              {parseDate(announcement.createdAt)}
            </Flex>
          </HStack>
        ))
      ) : (
        <Center w="full" h="full">
          <Text>お知らせはありません</Text>
        </Center>
      )}
    </VStack>
  )
}

export default NotificationsPage
