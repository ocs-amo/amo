"use client"
import type { TopicType } from "@prisma/client"
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
  Center,
  GridItem,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
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
import { ThreadMenuButton } from "../forms/thread-menu-button"
import { AnnouncementCard } from "./announcement-card"
import { ThreadCard } from "./thread-card"
import {
  getAnnouncementByIdAction,
  submitAnnouncementDelete,
} from "@/actions/circle/announcement"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import {
  fetchTopics,
  getThreadByIdAction,
  submitThreadDelete,
} from "@/actions/circle/thread"
import type { getAnnouncementById } from "@/data/announcement"
import type { getThreadById } from "@/data/thread"
import { parseDate } from "@/utils/format"

interface CircleThreadsProps {
  userId: string
  isAdmin?: boolean
  isMember?: boolean
  circle: Awaited<ReturnType<typeof getCircleById>>
  currentThread?: Awaited<ReturnType<typeof getThreadById>>
  currentAnnouncement?: Awaited<ReturnType<typeof getAnnouncementById>>
}

export const CircleThreads: FC<CircleThreadsProps> = ({
  userId,
  isAdmin,
  isMember,
  circle,
  currentThread: thread,
  currentAnnouncement: announcement,
}) => {
  const [currentThread, setCurrentThread] = useState(thread)
  const [currentAnnouncement, setCurrentAnnouncement] = useState(announcement)
  const [loading, { off: loadingOff, on: loadingOn }] = useBoolean(true)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [topics, setTopics] = useState<Awaited<ReturnType<typeof fetchTopics>>>(
    [],
  )
  const { snack, snacks } = useSnacks()

  const fetchData = async () => {
    loadingOn()
    const data = await fetchTopics(circle?.id || "")
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
    const newCurrentThread = await getThreadByIdAction(thread?.id || "")
    setCurrentThread(newCurrentThread)
    const newCurrentAnnouncement = await getAnnouncementByIdAction(
      announcement?.id || "",
    )
    setCurrentAnnouncement(newCurrentAnnouncement)
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

  useSafeLayoutEffect(() => {
    fetchData()
  }, [selectedOptions])
  return (
    <VStack gap="md">
      <Snacks snacks={snacks} />
      {currentThread ? (
        <ThreadCard
          userId={userId}
          circleId={circle?.id || ""}
          currentThread={currentThread}
          isAdmin={!!isAdmin}
          fetchData={fetchData}
          handleDelete={handleDelete}
        />
      ) : currentAnnouncement ? (
        <AnnouncementCard
          userId={userId}
          circleId={circle?.id || ""}
          currentAnnouncement={currentAnnouncement}
          isAdmin={!!isAdmin}
          handleDelete={handleDelete}
        />
      ) : (
        <>
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
                  <CardBody as={LinkBox}>
                    <HStack w="full" gap="4" justifyContent="space-around">
                      <HStack w="full">
                        <Avatar src={topic.user.image || ""} />
                        <VStack gap="sm" w="auto" alignItems="center">
                          {topic.isImportant && (
                            <Badge
                              w="full"
                              textAlign="center"
                              colorScheme="red"
                            >
                              重要
                            </Badge>
                          )}
                          <Badge
                            w="full"
                            textAlign="center"
                            colorScheme={
                              topic.type === "announcement"
                                ? "secondary"
                                : "primary"
                            }
                          >
                            {topic.type === "announcement"
                              ? "お知らせ"
                              : "スレッド"}
                          </Badge>
                        </VStack>
                        <Text
                          as={LinkOverlay}
                          href={`/circles/${circle?.id}/${topic.type}/${topic.id}`}
                          fontWeight="bold"
                        >
                          {topic.title}
                        </Text>
                      </HStack>
                      <HStack w="full" justifyContent="end">
                        <Text fontSize="sm" color="gray.500">
                          {parseDate(topic.createdAt)}
                        </Text>
                        {isAdmin || topic.userId === userId ? (
                          <ThreadMenuButton
                            editLink={`/circles/${circle?.id}/${topic.type}/${topic.id}/edit`}
                            handleDelete={() =>
                              handleDelete(topic.id, topic.type)
                            }
                          />
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
        </>
      )}
    </VStack>
  )
}
