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
import { CircleDetailTabs } from "../disclosure/circle-detail-tabs"
import { CircleMembershipButton } from "../forms/circle-membership-button"
import type { getMembershipRequests } from "@/actions/circle/membership-request"
import type { getCircleById } from "@/data/circle"
import { randomInteger } from "@/utils/random"

export const CircleDetailPage: FC<{
  circle: Awaited<ReturnType<typeof getCircleById>>
  membershipRequests: Awaited<ReturnType<typeof getMembershipRequests>>
  tabKey?: string
  userId: string
}> = ({ userId, circle, tabKey, membershipRequests }) => {
  if (!circle) {
    return <>サークルがありません</>
  }

  const isMember = circle.members?.some((member) => member.id === userId)
  // ユーザーがサークルの管理者かどうかを確認
  const isAdmin = circle.members?.some(
    (member) => member.id === userId && member.role,
  )

  return (
    <VStack w="full" h="fit-content" gap={0} p={0}>
      <Box w="full" h="2xs">
        <Image
          w="full"
          h="full"
          src={`https://picsum.photos/seed/${randomInteger(100)}/200/100`}
          alt="preview image"
          objectFit="cover"
        />
      </Box>
      <VStack w="full" flexGrow={1} p="md">
        <Heading>{circle.name}</Heading>
        <HStack w="full">
          <VStack>
            <Text as="pre">{circle.description}</Text>
            <HStack>
              {circle.tags?.map((tag) => <Tag key={tag.id}>{tag.tagName}</Tag>)}
            </HStack>
          </VStack>
          <VStack alignItems="end">
            <Text>
              講師：
              {circle.instructors
                ?.map((instructor) => instructor.name)
                .join(", ")}
            </Text>
            <Text>人数：{circle.memberCount}人</Text>
            <Text>活動場所：{circle.location}</Text>
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
          circle={circle}
          tabKey={tabKey}
          membershipRequests={membershipRequests}
          userId={userId}
        />
      </VStack>
    </VStack>
  )
}
