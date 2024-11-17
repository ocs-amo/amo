"use client"

import type { TopicType } from "@prisma/client"
import type { FC } from "@yamada-ui/react"
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { ThreadMenuButton } from "../forms/thread-menu-button"
import type { getAnnouncementById } from "@/data/announcement"
import { parseDate } from "@/utils/format"

interface AnnouncementCardProps {
  userId: string
  circleId: string
  isAdmin: boolean
  currentAnnouncement: NonNullable<
    Awaited<ReturnType<typeof getAnnouncementById>>
  >
  handleDelete: (topicId: string, type: TopicType) => Promise<void>
}

export const AnnouncementCard: FC<AnnouncementCardProps> = ({
  isAdmin,
  userId,
  circleId,
  currentAnnouncement,
  handleDelete,
}) => {
  const router = useRouter()
  return (
    <Card w="full" h="full">
      <CardBody>
        <HStack w="full">
          <Avatar src={currentAnnouncement.user.image || ""} />
          <VStack w="full">
            <HStack justifyContent="space-between">
              <HStack>
                {currentAnnouncement.isImportant && (
                  <Badge textAlign="center" colorScheme="red">
                    重要
                  </Badge>
                )}
                <Text>{currentAnnouncement.title}</Text>
              </HStack>
              {isAdmin || currentAnnouncement.userId === userId ? (
                <ThreadMenuButton
                  editLink={`/circles/${circleId}/${currentAnnouncement.type}/${currentAnnouncement.id}/edit`}
                  handleDelete={() => {
                    handleDelete(
                      currentAnnouncement.id,
                      currentAnnouncement.type,
                    )
                    router.push(`/circles/${circleId}/notifications/`)
                  }}
                />
              ) : undefined}
            </HStack>
            <Text as="pre">{currentAnnouncement.content}</Text>
            <HStack justifyContent="end">
              <Text>{parseDate(currentAnnouncement.createdAt)}</Text>
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  )
}
