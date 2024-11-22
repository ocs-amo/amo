"use client"
import { Dropzone, IMAGE_ACCEPT_TYPE } from "@yamada-ui/dropzone"
import type { FC } from "@yamada-ui/react"
import {
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Label,
  Text,
  Textarea,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"

interface AlbumFormProps {
  circleId: string
  userId: string
  mode: "create" | "edit"
}

export const AlbumForm: FC<AlbumFormProps> = ({ circleId, mode }) => {
  return (
    <VStack
      w="full"
      h="full"
      as="form"
      onSubmit={(e) => e.preventDefault()}
      p="md"
    >
      <Heading>アルバム作成</Heading>
      <FormControl
        display="flex"
        flexDirection={{ base: "row", md: "column" }}
        gap={{ base: "2xl", md: "md" }}
        //   isInvalid={!!errors.title}
      >
        <VStack w="full">
          <Label flexGrow={1} isRequired>
            画像を選択
          </Label>
          <Dropzone multiple accept={IMAGE_ACCEPT_TYPE} size="full" h="xs">
            <Text>画像をドラッグ&ドロップ</Text>
          </Dropzone>
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
        //   isInvalid={!!errors.title}
      >
        <VStack w="full">
          <Label flexGrow={1} isRequired>
            タイトル
          </Label>
          <Input
            type="text"
            // w={{ base: "md", md: "full" }}
            placeholder="タイトルを入力"
            //   {...register("title")}
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
        //   isInvalid={!!errors.title}
      >
        <VStack w="full">
          <Label flexGrow={1} isRequired>
            内容
          </Label>
          <Textarea
            placeholder="内容を入力"
            autosize
            minH="2xs"
            //   {...register("content")}
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
      <Center gap="md" justifyContent="end">
        <Button as={Link} href={`/circles/${circleId}/album`}>
          キャンセル
        </Button>
        <Button type="submit">{mode === "create" ? "作成" : "更新"}</Button>
      </Center>
    </VStack>
  )
}
