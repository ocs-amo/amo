"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@yamada-ui/calendar"
import type { FC } from "@yamada-ui/react"
import {
  Button,
  Center,
  ErrorMessage,
  FormControl,
  Heading,
  Input,
  Label,
  Spacer,
  Textarea,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import type { getCircleById } from "@/data/circle"
import type { ActivityFormType} from "@/schema/activity";
import { ActivitySchema } from "@/schema/activity"

interface ActivityFormProps {
  userId: string
  circleId: string
  circle?: Awaited<ReturnType<typeof getCircleById>>
}

export const ActivityForm: FC<ActivityFormProps> = ({ circleId, circle }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActivityFormType>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: undefined,
      startTime: "",
      endTime: "",
      notes: "",
    },
  })
  const onSubmit = async (values: ActivityFormType) => {
    console.log(values)
  }
  return (
    <VStack
      w="full"
      h="full"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p="md"
    >
      <VStack p="md" maxW="5xl" m="auto" gap="lg" flexGrow={1}>
        <Heading>{`${circle?.name} 活動日程`}</Heading>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          isInvalid={!!errors.title}
        >
          <Label flexGrow={1} isRequired>
            見出し
          </Label>
          <VStack w="auto">
            <Input
              type="text"
              w={{ base: "md", md: "full" }}
              placeholder="見出しを入力"
              {...register("title")}
            />
            {errors.title ? (
              <ErrorMessage mt={0}>{errors.title.message}</ErrorMessage>
            ) : (
              <>
                <Spacer />
                <Spacer />
              </>
            )}
          </VStack>
        </FormControl>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          isInvalid={!!errors.description}
        >
          <Label flexGrow={1}>内容</Label>
          <VStack w="auto">
            <Textarea
              w={{ base: "md", md: "full" }}
              placeholder="活動内容を入力"
              autosize
              {...register("description")}
            />
            {errors.description ? (
              <ErrorMessage mt={0}>{errors.description.message}</ErrorMessage>
            ) : (
              <>
                <Spacer />
                <Spacer />
              </>
            )}
          </VStack>
        </FormControl>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          isInvalid={!!errors.date}
        >
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <>
                <Label flexGrow={1} isRequired>
                  日付
                </Label>
                <VStack w="auto">
                  <DatePicker
                    locale="ja"
                    w={{ base: "md", md: "full" }}
                    placeholder="YYYY/MM/DD"
                    {...field}
                  />
                  {errors.date ? (
                    <ErrorMessage mt={0}>{errors.date.message}</ErrorMessage>
                  ) : (
                    <>
                      <Spacer />
                      <Spacer />
                    </>
                  )}
                </VStack>
              </>
            )}
          />
        </FormControl>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          isInvalid={!!errors.location}
        >
          <Label flexGrow={1}>場所</Label>
          <VStack w="auto">
            <Input
              type="text"
              w={{ base: "md", md: "full" }}
              placeholder="場所を入力"
              {...register("location")}
            />
            {errors.location ? (
              <ErrorMessage mt={0}>{errors.location.message}</ErrorMessage>
            ) : (
              <>
                <Spacer />
                <Spacer />
              </>
            )}
          </VStack>
        </FormControl>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          isInvalid={!!errors.startTime}
        >
          <Label flexGrow={1} isRequired>
            開始時間
          </Label>
          <VStack w="auto">
            <Input
              type="time"
              w={{ base: "md", md: "full" }}
              placeholder="開始時間を入力"
              {...register("startTime")}
            />
            {errors.startTime ? (
              <ErrorMessage mt={0}>{errors.startTime.message}</ErrorMessage>
            ) : (
              <>
                <Spacer />
                <Spacer />
              </>
            )}
          </VStack>
        </FormControl>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          isInvalid={!!errors.endTime}
        >
          <Label flexGrow={1}>終了時間</Label>
          <VStack w="auto">
            <Input
              type="time"
              w={{ base: "md", md: "full" }}
              placeholder="終了時間を入力"
              {...register("endTime")}
            />
            {errors.endTime ? (
              <ErrorMessage mt={0}>{errors.endTime.message}</ErrorMessage>
            ) : (
              <>
                <Spacer />
                <Spacer />
              </>
            )}
          </VStack>
        </FormControl>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          isInvalid={!!errors.notes}
        >
          <Label flexGrow={1}>備考</Label>
          <VStack w="auto">
            <Textarea
              w={{ base: "md", md: "full" }}
              placeholder="備考欄"
              autosize
              {...register("notes")}
            />
            {errors.notes ? (
              <ErrorMessage mt={0}>{errors.notes.message}</ErrorMessage>
            ) : (
              <>
                <Spacer />
                <Spacer />
              </>
            )}
          </VStack>
        </FormControl>
        <Center gap="md" justifyContent="end">
          <Button as={Link} href={`/circles/${circleId || ""}/activities`}>
            キャンセル
          </Button>
          <Button type="submit">追加</Button>
        </Center>
      </VStack>
    </VStack>
  )
}
