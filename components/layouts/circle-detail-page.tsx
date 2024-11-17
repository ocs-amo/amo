"use client"
import type { FC } from "@yamada-ui/react"
import {
  Box,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react"
import { useState } from "react"
import { CircleDetailTabs } from "../disclosure/circle-detail-tabs"
import { CircleMembershipButton } from "../forms/circle-membership-button"
import { getCircleById } from "@/actions/circle/fetch-circle"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import type { getActivityById } from "@/data/activity"
import type { getThreadById } from "@/data/thread"

export const CircleDetailPage: FC<{
  circle: Awaited<ReturnType<typeof getCircleById>>
  membershipRequests: Awaited<ReturnType<typeof getMembershipRequests>>
  tabKey?: string
  userId: string
  currentActivity?: Awaited<ReturnType<typeof getActivityById>>
  currentThread?: Awaited<ReturnType<typeof getThreadById>>
}> = ({
  userId,
  circle,
  tabKey,
  membershipRequests,
  currentActivity,
  currentThread,
}) => {
  const [circleData, setCircleData] =
    useState<Awaited<ReturnType<typeof getCircleById>>>(circle)
  const [requests, setRequests] =
    useState<Awaited<ReturnType<typeof getMembershipRequests>>>(
      membershipRequests,
    )
  const fetchData = async () => {
    if (circle?.id) {
      setCircleData(await getCircleById(circle.id))
      setRequests(await getMembershipRequests(userId, circle.id))
    }
  }

  const isMember = circle?.members?.some((member) => member.id === userId)
  // ユーザーがサークルの管理者かどうかを確認
  const isAdmin = circle?.members?.some(
    (member) => member.id === userId && [0, 1].includes(member.role.id),
  )

  return (
    <VStack w="full" h="fit-content" gap={0} p={0}>
      <Box w="full" h="2xs">
        {circle?.imagePath ? (
          <Image
            w="full"
            h="full"
            src={circle?.imagePath}
            alt="preview image"
            objectFit="cover"
          />
        ) : (
          <Box w="full" h="full" backgroundColor="gray.100" />
        )}
      </Box>
      <VStack w="full" flexGrow={1} p="md">
        <Heading>{circle?.name}</Heading>
        <HStack
          w="full"
          flexDirection={{
            base: `row`,
            md: `column`,
          }}
        >
          <VStack>
            <Text as="pre" textWrap="wrap">
              {circle?.description}
            </Text>
            <HStack flexWrap="wrap">
              {circle?.tags?.map((tag) => (
                <Tag key={tag.id}>{tag.tagName}</Tag>
              ))}
            </HStack>
          </VStack>
          <VStack alignItems="end">
            <Text>
              講師：
              {circle?.instructors
                ?.map((instructor) => instructor.name)
                .join(", ")}
            </Text>
            <Text>人数：{circleData?.members?.length}人</Text>
            <Text>活動場所：{circle?.location}</Text>
            <Box>
              <CircleMembershipButton
                circleId={circle?.id || ""}
                userId={userId}
                isAdmin={!!isAdmin}
                isMember={!!isMember}
              />
            </Box>
          </VStack>
        </HStack>
        <CircleDetailTabs
          circle={circleData}
          tabKey={tabKey}
          membershipRequests={requests}
          userId={userId}
          isAdmin={isAdmin}
          isMember={isMember}
          currentActivity={currentActivity}
          currentThread={currentThread}
          fetchData={fetchData}
        />
      </VStack>
    </VStack>
  )
}
