"use client"

import {
  Avatar,
  Badge,
  Card,
  CardBody,
  Center,
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
import type { FC } from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { getCircleById } from "@/data/circle"

interface CircleDetailTabsProps {
  circle: Awaited<ReturnType<typeof getCircleById>>
  tabKey?: string
}

const handlingTab = (key: string) => {
  switch (key) {
    case "days":
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
}) => {
  const [tabIndex, setTabIndex] = useState(handlingTab(tabKey || ""))
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const router = useRouter()

  const handleChange = (index: number) => {
    setTabIndex(index)
    switch (index) {
      case 0:
        router.push(`/circles/${circle?.id}/days`)
        break
      case 1:
        router.push(`/circles/${circle?.id}/images`)
        break
      case 2:
        router.push(`/circles/${circle?.id}/notifications`)
        break
      case 3:
        router.push(`/circles/${circle?.id}/members`)
        break
      default:
        break
    }
  }

  return (
    <Tabs index={tabIndex} onChange={handleChange}>
      <TabList>
        <Tab>活動日程</Tab>
        <Tab>画像</Tab>
        <Tab>掲示板</Tab>
        <Tab>メンバー一覧</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>活動日程</TabPanel>
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
                  <CardBody position="relative">
                    <HStack gap="4" align="center">
                      <Avatar src={item.icon} />
                      {item.isImportant && (
                        <Badge colorScheme="red">重要</Badge>
                      )}
                      <Text fontWeight="bold">{item.title}</Text>
                    </HStack>
                    <VStack
                      position="absolute"
                      bottom="4px"
                      right="4px"
                      align="end"
                    >
                      <Text fontSize="sm" color="gray.500">
                        {item.date} {item.time}
                      </Text>
                    </VStack>
                  </CardBody>
                </GridItem>
              ))}
          </SimpleGrid>
        </TabPanel>

        <TabPanel>
          <SimpleGrid w="full" columns={{ base: 2, md: 1 }} gap="md">
            {circle?.members?.map((member) => (
              <GridItem key={member.id} w="full" rounded="md" as={Card}>
                <CardBody>
                  <HStack as={Center}>
                    <Avatar src={member.iconImagePath || ""} />
                    {member.role ? (
                      <Badge>{member.role.roleName}</Badge>
                    ) : (
                      <Badge visibility="hidden">一般</Badge>
                    )}
                    <Text>{member.name}</Text>
                    <Text>{member.studentNumber}</Text>
                  </HStack>
                </CardBody>
              </GridItem>
            ))}
          </SimpleGrid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
