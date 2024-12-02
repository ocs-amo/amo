import { InfoIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import {
  Avatar,
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from "@yamada-ui/react"
import type { getAnnouncementsByUserId } from "@/data/announcement"
import { parseDate } from "@/utils/format"

interface NotificationListItemProps {
  announcement: Awaited<ReturnType<typeof getAnnouncementsByUserId>>[number]
  preview?: boolean
}

export const NotificationListItem: FC<NotificationListItemProps> = ({
  announcement,
  preview,
}) => {
  return (
    <HStack bg="white" as={Card}>
      <HStack as={LinkBox} w="full" p="sm">
        <Box>
          <Avatar
            src={announcement.user.profileImageUrl || ""}
            alt={`${announcement.user.name}のアイコン画像`}
          />
        </Box>
        <VStack
          as={LinkOverlay}
          href={`/circles/${announcement.circleId}/announcement/${announcement.id}`}
        >
          <Text>{announcement.circle.name}</Text>
          <HStack gap="sm">
            {announcement.isImportant ? (
              <InfoIcon fontSize="lg" color="primary" />
            ) : undefined}
            <Heading size="xs" as="h4">
              {announcement.title}
            </Heading>
          </HStack>
          {preview && (
            <Text as="pre" textWrap="wrap">
              {announcement.content}
            </Text>
          )}
          <Flex justifyContent="right">
            {parseDate(announcement.createdAt)}
          </Flex>
        </VStack>
      </HStack>
    </HStack>
  )
}
