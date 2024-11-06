"use client"
import { DatePicker } from "@yamada-ui/calendar"
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
import "dayjs/locale/ja"
import Link from "next/link"

interface Props {
  params: { circle_id?: string }
}

const Page = ({ params }: Props) => {
  const { circle_id: circleId } = params
  return (
    <VStack
      w="full"
      h="full"
      as="form"
      onSubmit={(e) => e.preventDefault()}
      p="md"
    >
      <VStack p="md" maxW="5xl" m="auto" gap="lg" flexGrow={1}>
        <Heading>{params.circle_id} 活動日程</Heading>
        <FormControl
          display="flex"
          flexDirection={{ base: "row", md: "column" }}
          gap={{ base: "2xl", md: "md" }}
          maxW="2xl"
          // isInvalid={!!errors.name}
        >
          <Label flexGrow={1} isRequired>
            見出し
          </Label>
          <VStack w="auto">
            <Input
              type="text"
              w={{ base: "md", md: "full" }}
              placeholder="見出しを入力"
              // {...register("name")}
            />
            {/* {errors.name ? (
                        <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
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
          // isInvalid={!!errors.name}
        >
          <Label flexGrow={1}>内容</Label>
          <VStack w="auto">
            <Textarea
              w={{ base: "md", md: "full" }}
              placeholder="活動内容を入力"
              autosize
              // {...register("name")}
            />
            {/* {errors.name ? (
                        <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
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
          // isInvalid={!!errors.name}
        >
          <Label flexGrow={1} isRequired>
            日付
          </Label>
          <VStack w="auto">
            <DatePicker
              locale="ja"
              w={{ base: "md", md: "full" }}
              placeholder="YYYY/MM/DD"
            />
            {/* {errors.name ? (
                        <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
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
          // isInvalid={!!errors.name}
        >
          <Label flexGrow={1}>場所</Label>
          <VStack w="auto">
            <Input
              type="text"
              w={{ base: "md", md: "full" }}
              placeholder="場所を入力"
              // {...register("name")}
            />
            {/* {errors.name ? (
                        <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
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
          // isInvalid={!!errors.name}
        >
          <Label flexGrow={1} isRequired>
            開始時間
          </Label>
          <VStack w="auto">
            <Input
              type="time"
              w={{ base: "md", md: "full" }}
              placeholder="開始時間を入力"
              // {...register("name")}
            />
            {/* {errors.name ? (
                        <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
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
          // isInvalid={!!errors.name}
        >
          <Label flexGrow={1}>終了時間</Label>
          <VStack w="auto">
            <Input
              type="time"
              w={{ base: "md", md: "full" }}
              placeholder="終了時間を入力"
              // {...register("name")}
            />
            {/* {errors.name ? (
                        <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
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
          // isInvalid={!!errors.name}
        >
          <Label flexGrow={1}>備考</Label>
          <VStack w="auto">
            <Textarea
              w={{ base: "md", md: "full" }}
              placeholder="備考欄"
              autosize
              // {...register("name")}
            />
            {/* {errors.name ? (
                        <ErrorMessage mt={0}>{errors.name.message}</ErrorMessage>
                    ) : (
                        <>
                            <Spacer />
                            <Spacer />
                        </>
                    )} */}
          </VStack>
        </FormControl>
        <Center gap="md" justifyContent="end">
          <Button as={Link} href={`/circles/${circleId || ""}`}>
            キャンセル
          </Button>
          <Button type="submit">追加</Button>
        </Center>
      </VStack>
    </VStack>
  )
}

export default Page
