import type {
  FC} from "@yamada-ui/react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react"
import { CircleDetailTabs } from "@/components/disclosure/circle-detail-tabs"
import { getCircleById, getCircles, getMemberByCircleId } from "@/data/circle"
import { randomInteger } from "@/utils/random"

interface Props {
  params: { circle_id?: string }
}

export const generateMetadata = async ({ params }: Props) => {
  const { circle_id } = params

  const circle = await getCircleById(circle_id || "")

  if (!circle) {
    return {
      title: "サークルが見つかりません。",
      description: "サークルが見つかりません。",
    }
  }

  return {
    title: circle.name,
    description: circle.description,
  }
}
export const dynamicParams = false

export const generateStaticParams = async () => {
  const circles = await getCircles()

  return circles?.map((circle) => ({ circle_id: circle.id }))
}

export const CircleDetailPage: FC<{
  circle: Awaited<ReturnType<typeof getCircleById>>
  members: Awaited<ReturnType<typeof getMemberByCircleId>>
  tabKey?: string
}> = ({ circle, members, tabKey }) => {
  if (!circle) {
    return <>サークルがありません</>
  }

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
              <Tag>初心者歓迎</Tag>
              <Tag>プログラミング</Tag>
              <Tag>パソコン</Tag>
            </HStack>
          </VStack>
          <VStack alignItems="end">
            <Text>講師：〇〇</Text>
            <Text>人数：{circle.memberCount}人</Text>
            <Text>活動場所：{circle.location}</Text>
            <Box>
              <Button>入会申請</Button>
            </Box>
          </VStack>
        </HStack>
        <CircleDetailTabs members={members} circle={circle} tabKey={tabKey} />
      </VStack>
    </VStack>
  )
}

const Page = async ({ params }: Props) => {
  const { circle_id } = params
  const circle = await getCircleById(circle_id || "")
  const members = await getMemberByCircleId(circle_id || "")

  return (
    <CircleDetailPage
      {...{
        circle,
        members,
      }}
    />
  )
}

export default Page
