import type { FC } from "@yamada-ui/react"
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { CircleDetailTabs } from "../disclosure/circle-detail-tabs"
import type { getCircleById } from "@/data/circle"

export const CircleDetailPage: FC<{
  circle: Awaited<ReturnType<typeof getCircleById>>
  tabKey?: string
  userId: string
}> = ({ userId, circle, tabKey }) => {
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
        {circle.imagePath ? (
          <Image
            w="full"
            h="full"
            src={circle.imagePath}
            alt="preview image"
            objectFit="cover"
          />
        ) : (
          <Box w="full" h="full" backgroundColor="gray.100" />
        )}
      </Box>
      <VStack w="full" flexGrow={1} p="md">
        <Heading>{circle.name}</Heading>
        <HStack w="full" flexDirection={{
          base: `row`,
            md: `column`,
        }}>
          <VStack>
            <Text>{circle.description}</Text>
            <HStack flexWrap="wrap">
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
              {/* 管理者であれば編集ボタンを表示 */}
              {isAdmin ? (
                <Button
                  colorScheme="primary"
                  as={Link}
                  href={`/circles/${circle.id}/edit`}
                >
                  編集
                </Button>
              ) : isMember ? (
                <Button>退会申請</Button>
              ) : (
                <Button>入会申請</Button>
              )}
            </Box>
          </VStack>
        </HStack>
        <CircleDetailTabs circle={circle} tabKey={tabKey} />
      </VStack>
    </VStack>
  )
}
