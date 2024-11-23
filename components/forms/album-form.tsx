"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dropzone, IMAGE_ACCEPT_TYPE } from "@yamada-ui/dropzone"
import type { FC } from "@yamada-ui/react"
import {
  Button,
  Center,
  CloseIcon,
  ErrorMessage,
  FormControl,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Input,
  Label,
  Text,
  Textarea,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { AlbumFormSchema } from "@/schema/album"
import type { FrontAlbumForm } from "@/schema/album"

interface AlbumFormProps {
  circleId: string
  userId: string
  mode: "create" | "edit"
}

export const AlbumForm: FC<AlbumFormProps> = ({ circleId, mode }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FrontAlbumForm>({
    resolver: zodResolver(AlbumFormSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
    },
  })

  const onSubmit = async (data: FrontAlbumForm) => {
    console.log(data)
  }

  return (
    <VStack w="full" as="form" onSubmit={handleSubmit(onSubmit)} p="md">
      <Heading>アルバム作成</Heading>
      <FormControl isInvalid={!!errors.images}>
        <Controller
          name="images"
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <>
              <Label isRequired>画像を選択</Label>
              <Dropzone
                multiple
                accept={IMAGE_ACCEPT_TYPE}
                size="full"
                h="xs"
                onDrop={onChange}
                ref={ref}
              >
                {value && value.length > 0 ? (
                  <Grid
                    templateColumns="repeat(5, 1fr)"
                    templateRows="repeat(2, 1fr)"
                    gap="md"
                  >
                    {Array.from(value).map((file, index) => (
                      <GridItem
                        w="full"
                        h="4xs"
                        rounded="md"
                        boxSize="100px"
                        key={`${file.name}-${index}`}
                        position="relative"
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          boxSize="full"
                          borderRadius="md"
                          objectFit="cover"
                        />
                        <IconButton
                          size="xs"
                          isRounded
                          icon={<CloseIcon />}
                          position="absolute"
                          top="-sm"
                          right="-sm"
                          onClick={(e) => e.stopPropagation()}
                          colorScheme="danger"
                        />
                      </GridItem>
                    ))}
                  </Grid>
                ) : (
                  <Text>画像をドラッグ&ドロップ</Text>
                )}
              </Dropzone>
              {errors?.images && (
                <ErrorMessage mt={0}>{errors.images.message}</ErrorMessage>
              )}
            </>
          )}
        />
      </FormControl>
      <FormControl isInvalid={!!errors.title}>
        <Label isRequired>タイトル</Label>
        <Input
          type="text"
          placeholder="タイトルを入力"
          {...register("title")}
        />
        {errors.title && (
          <ErrorMessage mt={0}>{errors.title.message}</ErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <Label isRequired>内容</Label>
        <Textarea
          placeholder="内容を入力"
          autosize
          minH="2xs"
          {...register("description")}
        />
        {errors.description && (
          <ErrorMessage mt={0}>{errors.description.message}</ErrorMessage>
        )}
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
