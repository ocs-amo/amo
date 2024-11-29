"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CameraIcon, FilePenLineIcon, TrashIcon } from "@yamada-ui/lucide"
import {
  Avatar,
  Button,
  Center,
  ErrorMessage,
  FileButton,
  FormControl,
  Heading,
  HStack,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Snacks,
  Text,
  Textarea,
  useBoolean,
  useSafeLayoutEffect,
  useSnacks,
  VStack,
  type FC,
} from "@yamada-ui/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { updateUserAction, type getUserById } from "@/actions/user/user"
import {
  BackUserProfileSchema,
  FrontUserProfileSchema,
  UserIconSchema,
} from "@/schema/user"
import type { FrontUserProfileForm } from "@/schema/user"

interface ProfileForm {
  user: Awaited<ReturnType<typeof getUserById>>
}

export const ProfileForm: FC<ProfileForm> = ({ user }) => {
  const [imagePreview, setImagePreview] = useState<string>(user?.image || "")
  const [isLoading, { on: start, off: end }] = useBoolean()
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FrontUserProfileForm>({
    resolver: zodResolver(FrontUserProfileSchema),
    defaultValues: {
      profileText: user?.profileText || "",
      image: user?.image || "",
    },
  })
  const { snack, snacks } = useSnacks()
  const router = useRouter()
  const onSubmit = async (data: FrontUserProfileForm) => {
    start()
    if (watch("image") && !data.image) {
      data.image = watch("image")
    }
    const {
      success,
      error,
      data: parseData,
    } = BackUserProfileSchema.safeParse(data)

    if (!success) {
      // エラーメッセージを表示
      console.error("Validation failed:", error)
      end()
      return
    }

    const result = await updateUserAction(parseData)
    if (result.success) {
      snack({ title: "プロフィールの更新に成功しました", status: "success" })
      router.push(`/user/${user?.id}`)
    } else {
      snack({
        title: result.error || "プロフィールの更新に失敗しました",
        status: "error",
      })
      end()
    }
  }

  // watchでimagePathを監視
  const image = watch("image") as unknown as FileList | null

  const updateImage = async () => {
    const { success, data } = await UserIconSchema.safeParseAsync(image)
    if (success && data) {
      setImagePreview(data)
    }
  }

  const onResetImage = () => {
    setValue("image", null)
    setImagePreview("")
  }

  // 画像選択時にプレビューを更新
  useSafeLayoutEffect(() => {
    updateImage()
  }, [image])

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      gap="md"
      w="full"
      maxW="3xl"
      h="full"
      m="auto"
      p="md"
    >
      <HStack w="full" m="auto" flexDir={{ base: "row", sm: "column" }}>
        <FormControl
          isInvalid={!!errors.image}
          errorMessage={errors.image ? errors.image.message : undefined}
          w="full"
          boxSize={{ base: "2xs", md: "24" }}
          position="relative"
          as={Center}
        >
          <Controller
            name="image"
            control={control}
            render={({ field: { ref, name, onChange, onBlur } }) => (
              <>
                <Avatar
                  src={imagePreview}
                  boxSize={{ base: "2xs", md: "24" }}
                />
                <Menu>
                  <MenuButton
                    as={Button}
                    leftIcon={<FilePenLineIcon fontSize="2xl" />}
                    colorScheme="riverBlue"
                    isRounded
                    position="absolute"
                    bottom={0}
                    right={0}
                    size="sm"
                  >
                    編集
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      as={FileButton}
                      variant="unstyled"
                      {...{ ref, name, onChange, onBlur }}
                      accept="image/*"
                      onChange={onChange}
                      leftIcon={<CameraIcon fontSize="xl" color="gray" />}
                      justifyContent="start"
                      size="sm"
                    >
                      ファイルを選択
                    </MenuItem>
                    <MenuItem
                      color="red"
                      as={Button}
                      variant="unstyled"
                      justifyContent="start"
                      size="sm"
                      leftIcon={<TrashIcon fontSize="xl" color="danger" />}
                      onClick={onResetImage}
                    >
                      削除
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            )}
          />
        </FormControl>
        <VStack maxW="xl">
          <Heading fontSize="2xl">{user?.name}</Heading>
          <HStack justifyContent="space-between" flexWrap="wrap">
            <Text>{user?.studentNumber}</Text>
          </HStack>
        </VStack>
      </HStack>
      <FormControl
        gap={{ base: "2xl", md: "md" }}
        isInvalid={!!errors.profileText}
        m="auto"
      >
        <Label flexGrow={1}>自己紹介</Label>
        <VStack w="auto">
          <Textarea
            placeholder="説明を入力"
            minH="md"
            autosize
            {...register("profileText")}
          />
          {errors.profileText ? (
            <ErrorMessage mt={0}>{errors.profileText.message}</ErrorMessage>
          ) : undefined}
        </VStack>
      </FormControl>
      <Snacks snacks={snacks} />
      <Center gap="md" justifyContent="end">
        <Button
          as={Link}
          href={`/user/${user?.id || ""}`}
          colorScheme="riverBlue"
        >
          キャンセル
        </Button>
        <Button type="submit" isLoading={isLoading} colorScheme="riverBlue">
          更新
        </Button>
      </Center>
    </VStack>
  )
}
