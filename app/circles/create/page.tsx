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
  Textarea,
  useAsync,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { getInstructors } from "@/data/user"
import { FrontCreateCircleSchema } from "@/schema/circle"
import type { FrontCreateCircleForm } from "@/schema/circle"

const CircleCreate = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FrontCreateCircleForm>({
    resolver: zodResolver(FrontCreateCircleSchema),
  })
  console.log(watch("imagePath"))
  console.log(errors)

  const onSubmit = async (values: FrontCreateCircleForm) => {
    console.log(values)
  }

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
      <Center w="full" h="40" backgroundColor="gray.100">
        {/* {
          watch("imagePath") ? <Image src={watch("imagePath")} w="full" h="full" objectFit="cover" /> : undefined
        } */}
        <FormControl
          isInvalid={!!errors.imagePath}
          errorMessage={errors.imagePath ? errors.imagePath.message : undefined}
        >
          <Controller
            name="imagePath"
            control={control}
            render={({ field: { ref, name, onChange, onBlur } }) => (
              <VStack alignItems="center" gap={0}>
                <FileButton
                  {...{ ref, name, onChange, onBlur }}
                  w="28"
                  h="28"
                  as={IconButton}
                  accept="image/*"
                  bg="gray.100"
                  icon={<CameraIcon fontSize="9xl" color="gray" />}
                />
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
              ) : undefined}
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
              {errors.name ? (
                <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
              ) : undefined}
            </VStack>
          </FormControl>
          <FormControl
            display="flex"
            flexDirection={{ base: "row", md: "column" }}
            gap={{ base: "2xl", md: "md" }}
            maxW="2xl"
          >
            <Controller
              name="instructors"
              control={control}
              rules={{
                required: { value: true, message: "This is required." },
              }}
              render={({ field }) => (
                <>
                  <Label flexGrow={1}>講師</Label>
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
            <Input
              type="text"
              w={{ base: "md", md: "full" }}
              placeholder="タグを入力"
            />
          </FormControl>
          <FormControl
            display="flex"
            flexDirection={{ base: "row", md: "column" }}
            gap={{ base: "2xl", md: "md" }}
            maxW="2xl"
          >
            <Label flexGrow={1}>活動場所</Label>
            <Input
              type="text"
              w={{ base: "md", md: "full" }}
              placeholder="活動場所を入力"
            />
          </FormControl>
          <FormControl
            display="flex"
            flexDirection={{ base: "row", md: "column" }}
            gap={{ base: "2xl", md: "md" }}
            maxW="2xl"
          >
            <Label flexGrow={1}>活動時間</Label>
            <Input
              type="text"
              w={{ base: "md", md: "full" }}
              placeholder="活動時間を入力"
            />
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
