"use client"
import type { FC } from "@yamada-ui/react"
import {
  Avatar,
  Box,
  Card,
  Divider,
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

interface NotificationPageProps {
  announcements: Awaited<ReturnType<typeof getAnnouncementsByUserId>>
}

export const NotificationPage: FC<NotificationPageProps> = ({
  announcements,
}) => {
  return (
    <PaginationList data={announcements}>
      {(currentAnnouncements) => (
        <VStack w="full" h="full" gap="md">
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
          {currentAnnouncements.length ? (
            currentAnnouncements.map((announcement) => (
              <HStack
                key={announcement.id}
                w="full"
                flexDir={{ sm: "column" }}
                gap={{ sm: "sm", base: "md" }}
              >
                <HStack flexGrow={1} as={Card} bg="white" w="full">
                  <HStack p="sm" w="full" h="full" as={LinkBox}>
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
                </HStack>
                <Text>{parseDate(announcement.createdAt)}</Text>
              </HStack>
            ))
          ) : (
            <Text>お知らせはありません</Text>
          )}
        </VStack>
      )}
    </PaginationList>
  )
}
