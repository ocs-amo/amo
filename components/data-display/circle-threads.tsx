"use client"
import {
  BellPlusIcon,
  EllipsisIcon,
  MessageCircleMoreIcon,
  PenIcon,
  PlusIcon,
  TrashIcon,
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
  useSafeLayoutEffect,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import { fetchTopics } from "@/actions/circle/thread"

interface CircleThreadsProps {
  isMember?: boolean
  circle: Awaited<ReturnType<typeof getCircleById>>
}

export const CircleThreads: FC<CircleThreadsProps> = ({ isMember, circle }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [topics, setTopics] = useState<Awaited<ReturnType<typeof fetchTopics>>>(
    [],
  )
  const fetchData = async () => {
    const data = await fetchTopics()
    setTopics(data)
  }

  useSafeLayoutEffect(() => {
    fetchData()
  }, [])
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
        {topics
          // .filter((item) => {
          //   if (selectedOptions.length === 0) {
          //     return true
          //   }
          //   // "重要"のみ
          //   if (
          //     selectedOptions.includes("重要") &&
          //     selectedOptions.length === 1
          //   ) {
          //     return item.isImportant
          //   }
          //   // "重要"と"スレッド"
          //   if (
          //     selectedOptions.includes("重要") &&
          //     selectedOptions.includes("スレッド")
          //   ) {
          //     return item.type === "スレッド" && item.isImportant
          //   }
          //   // "重要"と"お知らせ"
          //   if (
          //     selectedOptions.includes("重要") &&
          //     selectedOptions.includes("お知らせ")
          //   ) {
          //     return item.type === "お知らせ" && item.isImportant
          //   }
          //   // "スレッド"or"お知らせ"
          //   return selectedOptions.includes(item.type)
          // })
          .map((topic) => (
            <GridItem key={topic.id} w="full" rounded="md" as={Card}>
              <CardBody>
                <HStack w="full" gap="4" justifyContent="space-around">
                  <HStack w="full">
                    <Avatar src={topic.user.image || ""} />
                    {topic.isImportant && <Badge colorScheme="red">重要</Badge>}
                    <Text fontWeight="bold">{topic.title}</Text>
                  </HStack>
                  <HStack w="full" justifyContent="end">
                    <Text fontSize="sm" color="gray.500">
                      {`${topic.createdAt.getFullYear()}/${topic.createdAt.getMonth()}/${topic.createdAt.getDate()} ${topic.createdAt.getHours()}:${topic.createdAt.getMinutes()}`}
                    </Text>
                    {isMember ? (
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<EllipsisIcon fontSize="2xl" />}
                          variant="outline"
                        />

                        <MenuList>
                          <MenuItem icon={<PenIcon fontSize="2xl" />}>
                            編集
                          </MenuItem>
                          <MenuItem
                            icon={<TrashIcon fontSize="2xl" color="red" />}
                            color="red"
                          >
                            削除
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    ) : undefined}
                  </HStack>
                </HStack>
              </CardBody>
            </GridItem>
          ))}
      </SimpleGrid>
    </VStack>
  )
}
