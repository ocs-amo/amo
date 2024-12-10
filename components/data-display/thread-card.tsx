"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { TopicType } from "@prisma/client"
import { TriangleIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  HStack,
  IconButton,
  Snacks,
  Text,
  Textarea,
  useBoolean,
  useSafeLayoutEffect,
  useSnacks,
  VStack,
} from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import type { Socket } from "socket.io-client"
import { ThreadMenuButton } from "../forms/thread-menu-button"
import { PostCommentAction } from "@/actions/circle/thread-comment"
import type { getThreadById } from "@/data/thread"
import type { CommentFormInput } from "@/schema/topic"
import { CommentFormSchema } from "@/schema/topic"
import { parseFullDate } from "@/utils/format"

interface ThreadCardProps {
  socket: Socket
  userId: string
  circleId: string
  isAdmin: boolean
  currentThread: NonNullable<Awaited<ReturnType<typeof getThreadById>>>
  fetchData: () => Promise<void>
  handleDelete: (topicId: string, type: TopicType) => Promise<void>
}

export const ThreadCard: FC<ThreadCardProps> = ({
  circleId,
  currentThread,
  isAdmin,
  userId,
  socket,
  fetchData,
  handleDelete,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CommentFormInput>({ resolver: zodResolver(CommentFormSchema) })
  const router = useRouter()
  const { snack, snacks } = useSnacks()
  const [isSubmitting, { on: start, off: end }] = useBoolean(false)
  const onSubmit = async (data: CommentFormInput) => {
    start()
    const { success, error } = await PostCommentAction(
      currentThread.id,
      circleId,
      data,
    )
    snack.closeAll()
    if (success) {
      snack({ title: "コメントの作成に成功しました", status: "success" })
      await fetchData()
      socket.emit("onSubmit", currentThread.id)
      reset()
    } else {
      snack({ title: error || "コメントの作成に失敗しました", status: "error" })
    }
    end()
  }

  useSafeLayoutEffect(() => {
    fetch("/api/socketio", { method: "POST" }).then(() => {
      // 既に接続済だったら何もしない
      if (socket.connected) {
        return
      }
      // socket.ioサーバに接続
      socket.connect()
      // joinできなかった時のエラー取得
      socket.on("join_room_error", (data: string) => {
        console.error(data)
      })
      // join
      socket.emit("join_room", currentThread.id)
      // メッセージ受け取り
      socket.on("sync", () => {
        fetchData()
      })
    })

    return () => {
      // 登録したイベントは全てクリーンアップ
      socket.off("connect")
      socket.off("sync")
    }
  }, [socket])

  return (
    <>
      <Snacks snacks={snacks} />
      <Card w="full" h="full" bg="white">
        <CardHeader
          justifyContent="space-between"
          alignItems={{ md: "end" }}
          flexDir={{ base: "row", md: "column-reverse" }}
        >
          <HStack>
            <Avatar src={currentThread.user.profileImageUrl || ""} />
            <VStack gap={0}>
              <Text>{currentThread.title}</Text>
              <Text fontSize="sm" as="pre" textWrap="wrap">
                {currentThread.content}
              </Text>
            </VStack>
          </HStack>
          <VStack w="auto">
            <HStack>
              <Text>{parseFullDate(currentThread.createdAt)}</Text>
              {isAdmin || currentThread.userId === userId ? (
                <ThreadMenuButton
                  editLink={`/circles/${circleId}/${currentThread.type}/${currentThread.id}/edit`}
                  handleDelete={() => {
                    handleDelete(currentThread.id, currentThread.type)
                    router.push(`/circles/${circleId}/notifications/`)
                  }}
                />
              ) : undefined}
            </HStack>
            <Text>作成者：{currentThread.user.name}</Text>
          </VStack>
        </CardHeader>
        <CardBody flexGrow={1} minH="sm">
          {currentThread.comments.map((comment) => (
            <Card key={comment.id} w="full" variant="outline">
              <CardBody flexDir="row" justifyContent="space-between">
                <HStack>
                  <Avatar src={comment.user.profileImageUrl || ""} />
                  <VStack>
                    <Text>{comment.user.name}</Text>
                    <Text as="pre" textWrap="wrap">
                      {comment.content}
                    </Text>
                  </VStack>
                </HStack>
                <Text>{parseFullDate(comment.createdAt)}</Text>
              </CardBody>
            </Card>
          ))}
        </CardBody>
        <CardFooter
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          alignItems="start"
        >
          <FormControl
            isInvalid={!!errors.content}
            errorMessage={errors.content?.message}
          >
            <Textarea
              {...register("content")}
              autosize
              placeholder="メッセージを入力"
            />
          </FormControl>
          <IconButton
            type="submit"
            isLoading={isSubmitting}
            variant="ghost"
            icon={<TriangleIcon transform="rotate(90deg)" fill="black" />}
          />
        </CardFooter>
      </Card>
    </>
  )
}
