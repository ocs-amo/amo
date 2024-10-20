"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CameraIcon } from "@yamada-ui/lucide"
import {
  AutocompleteOption,
  Button,
  Center,
  ErrorMessage,
  FileButton,
  FormControl,
  Heading,
  IconButton,
  Input,
  Label,
  MultiAutocomplete,
  Spacer,
  Textarea,
  Tooltip,
  useAsync,
  useSafeLayoutEffect,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { getInstructors } from "@/data/user"
import { FrontCreateCircleSchema } from "@/schema/circle"
import type { FrontCreateCircleForm } from "@/schema/circle"

const CircleCreate = () => {
  const [imagePreview, setImagePreview] = useState<string>("")
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FrontCreateCircleForm>({
    resolver: zodResolver(FrontCreateCircleSchema),
    defaultValues: {
      instructors: [],
    },
  })

  const onSubmit = async (values: FrontCreateCircleForm) => {
    console.log(values)
  }

  // watchでimagePathを監視
  const imagePath = watch("imagePath") as unknown as FileList | null

  // 画像選択時にプレビューを更新
  useSafeLayoutEffect(() => {
    if (imagePath && imagePath.length > 0) {
      const file = imagePath[0]
      setImagePreview(URL.createObjectURL(file))
    } else {
      setImagePreview("")
    }
    // クリーンアップ関数でURLを解放
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePath])

  const { value } = useAsync(async () => ({
    instructors: (await getInstructors()).map((instructor) => ({
      label: instructor.name,
      value: instructor.id,
    })),
  }))
  return (
    <VStack
      gap={0}
      w="full"
      h="full"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Center
        w="full"
        h="40"
        minH="40"
        {...(imagePreview
          ? {
              backgroundImage: imagePreview,
              backgroundSize: "cover",
            }
          : {
              backgroundColor: "gray.100",
            })}
      >
        <FormControl
          isInvalid={!!errors.imagePath}
          errorMessage={errors.imagePath ? errors.imagePath.message : undefined}
        >
          <Controller
            name="imagePath"
            control={control}
            render={({ field: { ref, name, onChange, onBlur } }) => (
              <VStack alignItems="center" gap={0}>
                <Tooltip label="画像を選択" placement="bottom">
                  <FileButton
                    {...{ ref, name, onChange, onBlur }}
                    w="28"
                    h="28"
                    as={IconButton}
                    accept="image/*"
                    bg="gray.100"
                    onChange={onChange}
                    icon={<CameraIcon fontSize="9xl" color="gray" />}
                  />
                </Tooltip>
              </VStack>
            )}
          />
        </FormControl>
      </Center>
      <VStack p="md" maxW="5xl" m="auto" gap="lg" flexGrow={1}>
        <Heading as="h1" size="lg">
          サークル作成
        </Heading>
        <VStack px="md">
          <FormControl
            display="flex"
            flexDirection={{ base: "row", md: "column" }}
            gap={{ base: "2xl", md: "md" }}
            maxW="2xl"
            isInvalid={!!errors.name}
          >
            <Label flexGrow={1} isRequired>
              サークル名
            </Label>
            <VStack w="auto">
              <Input
                type="text"
                w={{ base: "md", md: "full" }}
                placeholder="サークル名を入力"
                {...register("name")}
              />
              {errors.name ? (
                <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
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
            <Label flexGrow={1} isRequired>
              説明
            </Label>
            <VStack w="auto">
              <Textarea
                w={{ base: "md", md: "full" }}
                placeholder="説明を入力"
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
            isInvalid={!!errors.instructors}
          >
            <Controller
              name="instructors"
              control={control}
              render={({ field }) => (
                <>
                  <Label flexGrow={1} isRequired>
                    講師
                  </Label>
                  <VStack w="auto">
                    <MultiAutocomplete
                      w={{ base: "md", md: "full" }}
                      placeholder="講師を選択"
                      {...field}
                    >
                      {value?.instructors.map((instructor) => (
                        <AutocompleteOption
                          value={instructor.value}
                          key={instructor.value}
                        >
                          {instructor.label}
                        </AutocompleteOption>
                      ))}
                    </MultiAutocomplete>
                    {errors.instructors ? (
                      <ErrorMessage mt={0}>
                        {errors.instructors.message}
                      </ErrorMessage>
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
          >
            <Label flexGrow={1}>タグ</Label>
            <VStack w="auto">
              <Input
                type="text"
                w={{ base: "md", md: "full" }}
                placeholder="タグを入力（カンマ区切り）"
                {...register("tags")}
              />
              <Spacer />
              <Spacer />
            </VStack>
          </FormControl>
          <FormControl
            display="flex"
            flexDirection={{ base: "row", md: "column" }}
            gap={{ base: "2xl", md: "md" }}
            maxW="2xl"
            isInvalid={!!errors.location}
          >
            <Label flexGrow={1} isRequired>
              活動場所
            </Label>
            <VStack w="auto">
              <Input
                {...register("location")}
                type="text"
                w={{ base: "md", md: "full" }}
                placeholder="活動場所を入力"
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
            isInvalid={!!errors.activityDay}
          >
            <Label flexGrow={1} isRequired>
              活動日
            </Label>
            <VStack w="auto">
              <Input
                type="text"
                w={{ base: "md", md: "full" }}
                placeholder="活動日を入力"
                {...register("activityDay")}
              />
              {errors.activityDay ? (
                <ErrorMessage mt={0}>{errors.activityDay.message}</ErrorMessage>
              ) : (
                <>
                  <Spacer />
                  <Spacer />
                </>
              )}
            </VStack>
          </FormControl>
          <Center gap="md" justifyContent="end">
            <Button as={Link} href="/circles">
              キャンセル
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              作成
            </Button>
          </Center>
        </VStack>
      </VStack>
    </VStack>
  )
}

export default CircleCreate
