"use client"
import type { FC } from "@yamada-ui/react"
import { Card, CardBody, Center, HStack, Text, VStack } from "@yamada-ui/react"
import { ActivityMenuButton } from "../forms/activity-menu-button"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import type { getActivityById } from "@/data/activity"
import { displayTime } from "@/utils/format"

interface ActivityCardProps {
  userId: string
  circle: Awaited<ReturnType<typeof getCircleById>>
  currentActivity: NonNullable<Awaited<ReturnType<typeof getActivityById>>>
  isMember: boolean
  isAdmin: boolean
  handleParticipation: (activityId: number) => Promise<void>
  handleDelete: (activityId: number) => Promise<void>
}

export const ActivityCard: FC<ActivityCardProps> = ({
  userId,
  circle,
  currentActivity,
  isMember,
  isAdmin,
  handleDelete,
  handleParticipation,
}) => {
  return (
    <Card w="full">
      <CardBody flexDir="row">
        <HStack>
          <Card variant="outline" padding="sm" w="10" as={Center}>
            {currentActivity.activityDay.getDate()}
          </Card>
        </HStack>
        <VStack>
          <HStack justifyContent="space-between">
            <Text>{currentActivity.title}</Text>
            <ActivityMenuButton
              userId={userId}
              isMember={isMember}
              isAdmin={isAdmin}
              circle={circle}
              activity={currentActivity}
              handleParticipation={handleParticipation}
              handleDelete={handleDelete}
            />
          </HStack>
          <HStack
            flexDir={{ base: "row", md: "column" }}
            alignItems={{ md: "start" }}
          >
            <Text whiteSpace="nowrap">内容:</Text>
            <Text text-wrap="auto" whiteSpace="pre-wrap">
              {currentActivity.description}
            </Text>
          </HStack>
          <HStack
            flexDir={{ base: "row", md: "column" }}
            alignItems={{ md: "start" }}
          >
            <Text>活動時間:</Text>
            <Text>
              {displayTime(currentActivity.startTime)}
              {currentActivity.endTime
                ? `～${displayTime(currentActivity.endTime)}`
                : undefined}
            </Text>
          </HStack>
          <HStack
            flexDir={{ base: "row", md: "column" }}
            alignItems={{ md: "start" }}
          >
            <Text>活動場所:</Text>
            <Text>{currentActivity.location}</Text>
          </HStack>
          <HStack
            flexDir={{ base: "row", md: "column" }}
            alignItems={{ md: "start" }}
          >
            <Text>参加人数:</Text>
            <Text>{currentActivity.participants.length}人</Text>
          </HStack>
          <HStack
            flexDir={{ base: "row", md: "column" }}
            alignItems={{ md: "start" }}
          >
            <Text whiteSpace="nowrap">備考:</Text>
            <Text text-wrap="auto" whiteSpace="pre-wrap">
              {currentActivity.notes}
            </Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )
}
