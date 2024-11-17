"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
  useSnacks,
  VStack,
} from "@yamada-ui/react"
import { useForm } from "react-hook-form"
import { PostCommentAction } from "@/actions/circle/thread-comment"
import type { getThreadById } from "@/data/thread"
import type { CommentFormInput } from "@/schema/topic"
import { CommentFormSchema } from "@/schema/topic"
import { parseDate } from "@/utils/format"

interface ThreadCardProps {
  userId: string
  circleId: string
  currentThread: NonNullable<Awaited<ReturnType<typeof getThreadById>>>
  fetchData: () => Promise<void>
}

export const ThreadCard: FC<ThreadCardProps> = ({
  circleId,
  currentThread,
  fetchData,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CommentFormInput>({ resolver: zodResolver(CommentFormSchema) })
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
      reset()
    } else {
      snack({ title: error || "コメントの作成に失敗しました", status: "error" })
    }
    end()
  }
  return (
    <>
      <Snacks snacks={snacks} />
      <Card w="full" h="full">
        <CardHeader justifyContent="space-between">
          <HStack>
            <Avatar src={currentThread.user.image || ""} />
            <VStack gap={0}>
              <Text>{currentThread.title}</Text>
              <Text fontSize="sm">{currentThread.content}</Text>
            </VStack>
          </HStack>
          <HStack>
            <Text>{parseDate(currentThread.createdAt)}</Text>
          </HStack>
        </CardHeader>
        <CardBody flexGrow={1} minH="sm">
          {currentThread.comments.map((comment) => (
            <Card key={comment.id} w="full" variant="outline">
              <CardBody flexDir="row" justifyContent="space-between">
                <HStack>
                  <Avatar src={comment.user.image || ""} />
                  <VStack>
                    <Text>{comment.user.name}</Text>
                    <Text>{comment.content}</Text>
                  </VStack>
                </HStack>
                <Text>{parseDate(comment.createdAt)}</Text>
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
            <Textarea {...register("content")} autosize />
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
