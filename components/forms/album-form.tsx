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
import { handleCreateAlbum, handleUpdateAlbum } from "@/actions/circle/album"
import type { getAlbumById } from "@/data/album"
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
  album?: Awaited<ReturnType<typeof getAlbumById>>
}

export const AlbumForm: FC<AlbumFormProps> = ({ circleId, mode, album }) => {
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
      title: album?.title,
      description: album?.description,
      images: album?.images ? album.images.map((image) => image.imageUrl) : [],
    },
    mode: "all",
  })
  const [isLoading, { on: start, off: end }] = useBoolean()
  const { snack, snacks } = useSnacks()
  const router = useRouter()

  const onSubmit = async (data: FrontAlbumForm) => {
    start()
    const { title, description, images } = data

    // 画像を Base64 に変換
    const base64Images = await Promise.all(
      images.map((image) =>
        typeof image === "string" ? image : getBase64Image(image),
      ),
    )

    const {
      success,
      error,
      data: parseData,
    } = BackAlbumSchema.safeParse({
      title,
      description,
      images: base64Images,
    })

    if (!success) {
      snack({ title: error.message, status: "error" })
      end()
      return
    }

    const result =
      mode === "create"
        ? await handleCreateAlbum(parseData, circleId)
        : await handleUpdateAlbum(parseData, circleId, album?.id || "")

    if (result.success) {
      router.push(`/circles/${circleId}/album/`)
    } else {
      snack({ title: result.error, status: "error" })
      end()
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
                onDrop={async (acceptedFiles, fileRejections) => {
                  const files = [
                    ...acceptedFiles,
                    ...fileRejections.map(
                      (fileRejection) => fileRejection.file,
                    ),
                  ]
                  const { success, error, data } =
                    await AlbumImageSchema.safeParseAsync([...value, ...files])

                  if (success) {
                    onChange([...data])
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
                        key={`${file}-${index}`}
                        position="relative"
                      >
                        <Image
                          src={file}
                          alt={`${file}-${index}`}
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
