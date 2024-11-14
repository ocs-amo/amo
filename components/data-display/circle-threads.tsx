import {
  BellPlusIcon,
  MessageCircleMoreIcon,
  PlusIcon,
} from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  GridItem,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MultiSelect,
  Option,
  SimpleGrid,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"
import type { getCircleById } from "@/actions/circle/fetch-circle"

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

interface CircleThreadsProps {
  isMember?: boolean
  circle: Awaited<ReturnType<typeof getCircleById>>
}

export const CircleThreads: FC<CircleThreadsProps> = ({ isMember, circle }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  return (
    <VStack gap="md">
      <HStack>
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
        {isMember ? (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<PlusIcon fontSize="2xl" />}
              variant="outline"
            />

            <MenuList>
              <MenuItem icon={<BellPlusIcon fontSize="2xl" />}>
                お知らせ
              </MenuItem>
              <MenuItem
                icon={<MessageCircleMoreIcon fontSize="2xl" />}
                as={Link}
                href={`/circles/${circle?.id}/thread/create`}
              >
                スレッド
              </MenuItem>
            </MenuList>
          </Menu>
        ) : undefined}
      </HStack>
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
                    {item.isImportant && <Badge colorScheme="red">重要</Badge>}
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
    </VStack>
  )
}
