"use client"
import type { FC } from "@yamada-ui/react"
import {
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Label,
  Textarea,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"

interface ThreadFormProps {
  mode: "create" | "edit"
  userId: string
  circleId: string
}

export const ThreadForm: FC<ThreadFormProps> = ({ circleId, mode }) => {
  return (
    <VStack
      w="full"
      h="full"
      as="form"
      onSubmit={(e) => e.preventDefault()}
      p="md"
    >
      <VStack p="md" maxW="5xl" m="auto" gap="lg" flexGrow={1}>
        <Heading>タイトル</Heading>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          // isInvalid={!!errors.title}
        >
          <Label flexGrow={1} isRequired>
            タイトル
          </Label>
          <VStack w="auto">
            <Input
              type="text"
              w={{ base: "md", md: "full" }}
              placeholder="タイトルを入力"
              // {...register("title")}
            />
            {/* {errors.title ? (
                    <ErrorMessage mt={0}>{errors.title.message}</ErrorMessage>
                ) : (
                    <>
                        <Spacer />
                        <Spacer />
                    </>
                )} */}
          </VStack>
        </FormControl>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          // isInvalid={!!errors.description}
        >
          <Label flexGrow={1}>詳細</Label>
          <VStack w="auto">
            <Textarea
              w={{ base: "md", md: "full" }}
              placeholder="詳細を入力"
              autosize
              // {...register("description")}
            />
            {/* {errors.description ? (
                    <ErrorMessage mt={0}>{errors.description.message}</ErrorMessage>
                ) : (
                    <>
                        <Spacer />
                        <Spacer />
                    </>
                )} */}
          </VStack>
        </FormControl>
        <Center gap="md" justifyContent="end">
          <Button as={Link} href={`/circles/${circleId}/notifications`}>
            キャンセル
          </Button>
          <Button type="submit">{mode === "create" ? "作成" : "更新"}</Button>
        </Center>
      </VStack>
    </VStack>
  )
}
