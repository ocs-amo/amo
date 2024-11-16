"use client"
import type { TopicType } from "@prisma/client"
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
  Center,
  GridItem,
  HStack,
  IconButton,
  Loading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MultiSelect,
  Option,
  SimpleGrid,
  Snacks,
  Tag,
  Text,
  useBoolean,
  useSafeLayoutEffect,
  useSnacks,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"
import { submitAnnouncementDelete } from "@/actions/circle/announcement"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import { fetchTopics, submitThreadDelete } from "@/actions/circle/thread"

interface CircleThreadsProps {
  isMember?: boolean
  circle: Awaited<ReturnType<typeof getCircleById>>
}

export const CircleThreads: FC<CircleThreadsProps> = ({ isMember, circle }) => {
  const [loading, { off: loadingOff, on: loadingOn }] = useBoolean(true)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [topics, setTopics] = useState<Awaited<ReturnType<typeof fetchTopics>>>(
    [],
  )
  const { snack, snacks } = useSnacks()

  const fetchData = async () => {
    loadingOn()
    const data = await fetchTopics()
    const filterTopics = data.filter((item) => {
      if (selectedOptions.length === 0) {
        return true
      }
      // "重要"のみ
      if (
        selectedOptions.includes("isImportant") &&
        selectedOptions.length === 1
      ) {
        return item.isImportant
      }
      // "重要"と"スレッド"
      if (
        selectedOptions.includes("isImportant") &&
        selectedOptions.includes("thread")
      ) {
        return item.type === "thread" && item.isImportant
      }
      // "重要"と"お知らせ"
      if (
        selectedOptions.includes("thread") &&
        selectedOptions.includes("announcement")
      ) {
        return item.type === "announcement" && item.isImportant
      }
      // "スレッド"or"お知らせ"
      return selectedOptions.includes(item.type)
    })
    setTopics(filterTopics)
    loadingOff()
  }

  const handleDelete = async (topicId: string, type: TopicType) => {
    const { success, error } =
      type === "thread"
        ? await submitThreadDelete(topicId, circle?.id || "")
        : await submitAnnouncementDelete(topicId, circle?.id || "")
    snack.closeAll()
    if (success) {
      snack({
        title: `${type === "thread" ? "スレッド" : "お知らせ"}を削除しました。`,
        status: "success",
      })
      await fetchData()
    } else {
      snack({ title: error || "エラー", status: "error" })
    }
  }

  const parseDate = (date: Date) =>
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

  useSafeLayoutEffect(() => {
    fetchData()
  }, [selectedOptions])
  return (
    <VStack gap="md">
      <Snacks snacks={snacks} />
      <HStack>
        <MultiSelect
          placeholder="項目を選択"
          component={({ label, onRemove }) => (
            <Tag onClose={onRemove}>{label}</Tag>
          )}
          onChange={setSelectedOptions}
          value={selectedOptions}
        >
          <Option value="thread">スレッド</Option>
          <Option value="announcement">お知らせ</Option>
          <Option value="isImportant">重要</Option>
        </MultiSelect>
        {isMember ? (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<PlusIcon fontSize="2xl" />}
              variant="outline"
            />

            <MenuList>
              <MenuItem
                icon={<BellPlusIcon fontSize="2xl" />}
                as={Link}
                href={`/circles/${circle?.id}/announcement/create`}
              >
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
      {loading ? (
        <Center w="full" h="full">
          <Loading fontSize="xl" />
        </Center>
      ) : topics && topics.length > 0 ? (
        <SimpleGrid w="full" columns={1} gap="md">
          {topics.map((topic) => (
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
                      {parseDate(topic.createdAt)}
                    </Text>
                    {isMember ? (
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<EllipsisIcon fontSize="2xl" />}
                          variant="outline"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<PenIcon fontSize="2xl" />}
                            as={Link}
                            href={`/circles/${circle?.id}/${topic.type}/${topic.id}/edit`}
                          >
                            編集
                          </MenuItem>
                          <MenuItem
                            icon={<TrashIcon fontSize="2xl" color="red" />}
                            color="red"
                            onClick={() => handleDelete(topic.id, topic.type)}
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
      ) : (
        <Text>投稿がありません</Text>
      )}
    </VStack>
  )
}
