"use client"
import type { FC } from "@yamada-ui/react"
import {
  Avatar,
  Box,
  Card,
  Center,
  Flex,
  Heading,
  HStack,
  InfoIcon,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from "@yamada-ui/react"
import { PaginationList } from "../navigation/pagination-list"
import type { getAnnouncementsByUserId } from "@/data/announcement"
import { parseDate } from "@/utils/format"

interface NotificationList {
  announcements: Awaited<ReturnType<typeof getAnnouncementsByUserId>>
}

export const NotificationList: FC<NotificationList> = ({ announcements }) => (
  <PaginationList data={announcements}>
    {(announcements) => (
      <VStack w="full" h="full" overflowY="auto" gap="md">
        {announcements?.length ? (
          announcements?.map((announcement) => (
            <HStack key={announcement.id} bg="white" as={Card}>
              <HStack as={LinkBox} w="full" p="sm">
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
                  <Flex justifyContent="right">
                    {parseDate(announcement.createdAt)}
                  </Flex>
                </VStack>
              </HStack>
            </HStack>
          ))
        ) : (
          <Center w="full" h="full">
            <Text>お知らせはありません</Text>
          </Center>
        )}
      </VStack>
    )}
  </PaginationList>
)
