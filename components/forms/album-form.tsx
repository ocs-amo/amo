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
  Snacks,
  Text,
  Textarea,
  useBoolean,
  useSnacks,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { handleCreateAlbum } from "@/actions/circle/album"
import {
  AlbumImageSchema,
  BackAlbumSchema,
  FrontAlbumFormSchema,
} from "@/schema/album"
import type { FrontAlbumForm } from "@/schema/album"
import { getBase64Image } from "@/utils/file"

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
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FrontAlbumForm>({
    resolver: zodResolver(FrontAlbumFormSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
    },
    mode: "all",
  })
  const [isLoading, { on: start, off: end }] = useBoolean()
  const { snack, snacks } = useSnacks()
  const router = useRouter()

  const onSubmit = async (data: FrontAlbumForm) => {
    start()
    const { title, description, images } = data

    // Base64に変換 & サイズチェック
    const base64Images = await Promise.all(images.map(getBase64Image))

    const {
      success,
      error,
      data: parseData,
    } = BackAlbumSchema.safeParse({ title, description, images: base64Images })

    if (!success) {
      snack({ title: error.message, status: "error" })
      end()
      return
    }
    if (mode === "create") {
      const { success, error } = await handleCreateAlbum(parseData, circleId)
      if (success) {
        router.push(`/circles/${circleId}/album/`)
      } else {
        snack({ title: error, status: "error" })
        end()
      }
    }
  }

  return (
    <VStack w="full" as="form" onSubmit={handleSubmit(onSubmit)} p="md">
      <Heading>アルバム作成</Heading>
      <FormControl isInvalid={!!errors.images}>
        <Controller
          name="images"
          control={control}
          render={({ field: { onChange, value = [], ref, ...rest } }) => (
            <>
              <Label isRequired>画像を選択</Label>
              <Dropzone
                multiple
                accept={IMAGE_ACCEPT_TYPE}
                size="full"
                minH="xs"
                onDrop={(acceptedFiles, fileRejections) => {
                  const files = [
                    ...acceptedFiles,
                    ...fileRejections.map(
                      (fileRejection) => fileRejection.file,
                    ),
                  ]
                  const { success, error } = AlbumImageSchema.safeParse([
                    ...value,
                    ...files,
                  ])

                  if (success) {
                    onChange([...value, ...acceptedFiles])
                    clearErrors("images")
                  } else {
                    const errorMessage = error.errors?.[0]?.message
                    setError("images", {
                      type: "manual",
                      message: errorMessage || "不明なエラーが発生しました。",
                    })
                  }
                }}
                ref={ref}
                overflow="auto"
                maxFiles={10}
                {...rest}
              >
                {value.length > 0 ? (
                  <Grid
                    templateColumns="repeat(5, 1fr)"
                    templateRows="repeat(2, 1fr)"
                    gap="md"
                  >
                    {Array.from(value).map((file, index) => (
                      <GridItem
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
                          onClick={(e) => {
                            e.stopPropagation() // ドロップゾーンのクリックイベントを止める
                            const updatedFiles = value.filter(
                              (_, fileIndex) => fileIndex !== index,
                            ) // 削除対象以外を保持
                            onChange(updatedFiles) // 更新
                          }}
                          colorScheme="danger"
                          aria-label="画像削除"
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
      <Snacks snacks={snacks} />
      <Center gap="md" justifyContent="end">
        <Button as={Link} href={`/circles/${circleId}/album`}>
          キャンセル
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === "create" ? "作成" : "更新"}
        </Button>
      </Center>
    </VStack>
  )
}
