"use client"

import type { FC } from "@yamada-ui/react"
import {
  Indicator,
  Avatar,
  Badge,
  Card,
  CardBody,
  GridItem,
  HStack,
  MultiSelect,
  Option,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"
import { CircleActivitydays } from "../data-display/circle-activitydays"
import { CircleMembers } from "../data-display/circle-members"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import { type getMembershipRequests } from "@/actions/circle/membership-request"
import type { getActivityById } from "@/data/activity"

interface CircleDetailTabsProps {
  circle: Awaited<ReturnType<typeof getCircleById>>
  membershipRequests: Awaited<ReturnType<typeof getMembershipRequests>>
  tabKey?: string
  userId: string
  isAdmin?: boolean
  isMember?: boolean
  currentActivity?: Awaited<ReturnType<typeof getActivityById>>
  fetchData: () => Promise<void>
}

const handlingTab = (key: string) => {
  switch (key) {
    case "activities":
      return 0
    case "images":
      return 1
    case "notifications":
      return 2
    case "members":
      return 3
    default:
      return 0
  }
}

const dummyData = [
  {
    id: 1,
    title: "新メンバー",
    date: "2024.06.01",
    time: "9:00",
    icon: "",
    alert: true,
    type: "スレッド",
    isImportant: true,
  },
  {
    id: 2,
    title: "テスト期間中の活動",
    date: "2024.06.17",
    time: "15:16",
    icon: "",
    type: "スレッド",
    isImportant: false,
  },
  {
    id: 3,
    title: "やってみたいこと募集",
    date: "2024.06.14",
    time: "22:21",
    icon: "",
    type: "お知らせ",
    isImportant: true,
  },
  {
    id: 4,
    title: "やってみたくないこと募集",
    date: "2024.06.14",
    time: "22:21",
    icon: "",
    type: "お知らせ",
    isImportant: false,
  },
]

export const CircleDetailTabs: FC<CircleDetailTabsProps> = ({
  circle,
  tabKey,
  membershipRequests,
  userId,
  isAdmin,
  isMember,
  currentActivity,
  fetchData,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const userRole = circle?.members?.find((member) => member.id === userId)?.role
  const tabIndex = handlingTab(tabKey || "")
  const { data } = membershipRequests

  return (
    <Tabs index={tabIndex}>
      <TabList overflowX="auto" overflowY="hidden">
        <Tab
          flexShrink={0}
          as={Link}
          href={`/circles/${circle?.id}/activities`}
        >
          活動日程
        </Tab>
        <Tab flexShrink={0} as={Link} href={`/circles/${circle?.id}/images`}>
          画像
        </Tab>
        <Tab
          flexShrink={0}
          as={Link}
          href={`/circles/${circle?.id}/notifications`}
        >
          掲示板
        </Tab>
        <Tab flexShrink={0} as={Link} href={`/circles/${circle?.id}/members`}>
          <Indicator
            colorScheme="danger"
            size="sm"
            placement="right"
            offset={-1.5}
            label={data?.length}
            isDisabled={!data?.length || !isAdmin}
          >
            メンバー一覧
          </Indicator>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CircleActivitydays
            userId={userId}
            userRole={userRole}
            isAdmin={isAdmin}
            isMember={isMember}
            currentActivity={currentActivity}
            circle={circle}
          />
        </TabPanel>
        <TabPanel>画像</TabPanel>

        <TabPanel>
          <MultiSelect
            placeholder="項目を選択"
            component={({ label, onRemove }) => (
              <Tag onClose={onRemove}>{label}</Tag>
            )}
            onChange={setSelectedOptions}
            value={selectedOptions}
          >
            <Option value="スレッド">スレッド</Option>
            <Option value="お知らせ">お知らせ</Option>
            <Option value="重要">重要</Option>
          </MultiSelect>
          <SimpleGrid w="full" columns={1} gap="md">
            {dummyData
              .filter((item) => {
                if (selectedOptions.length === 0) {
                  return true
                }
                // "重要"のみ
                if (
                  selectedOptions.includes("重要") &&
                  selectedOptions.length === 1
                ) {
                  return item.isImportant
                }
                // "重要"と"スレッド"
                if (
                  selectedOptions.includes("重要") &&
                  selectedOptions.includes("スレッド")
                ) {
                  return item.type === "スレッド" && item.isImportant
                }
                // "重要"と"お知らせ"
                if (
                  selectedOptions.includes("重要") &&
                  selectedOptions.includes("お知らせ")
                ) {
                  return item.type === "お知らせ" && item.isImportant
                }
                // "スレッド"or"お知らせ"
                return selectedOptions.includes(item.type)
              })
              .map((item) => (
                <GridItem key={item.id} w="full" rounded="md" as={Card}>
                  <CardBody>
                    <HStack w="full" gap="4" justifyContent="space-around">
                      <HStack w="full">
                        <Avatar src={item.icon} />
                        {item.isImportant && (
                          <Badge colorScheme="red">重要</Badge>
                        )}
                        <Text fontWeight="bold">{item.title}</Text>
                      </HStack>
                      <VStack align="end">
                        <Text fontSize="sm" color="gray.500">
                          {item.date} {item.time}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </GridItem>
              ))}
          </SimpleGrid>
        </TabPanel>

        <TabPanel>
          <CircleMembers
            userId={userId}
            userRole={userRole}
            isAdmin={!!isAdmin}
            circle={circle}
            membershipRequests={membershipRequests}
            fetchData={fetchData}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
