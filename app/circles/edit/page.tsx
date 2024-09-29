"use client"
import { CameraIcon } from "@yamada-ui/lucide"
import type { SelectItem } from "@yamada-ui/react"
import {
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Label,
  Select,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"

const teachers: SelectItem[] = [
  {
    label: "野木",
    value: "野木",
  },
  {
    label: "西村",
    value: "西村",
  },
  {
    label: "木村",
    value: "木村",
  },
]

const students: SelectItem[] = [
  {
    label: "加古　林檎",
    value: "加古　林檎",
  },
  {
    label: "てばさき　三太郎",
    value: "てばさき　三太郎",
  },
  {
    label: "山田　太郎",
    value: "山田　太郎",
  },
]

const validateSelection = (
  value: string,
  otherValue: string,
  errorMessage: string,
  setErrorMessage: (message: string) => void,
) => {
  if (value === otherValue) {
    setErrorMessage(errorMessage)
  } else {
    setErrorMessage("")
  }
}

const CircleEdit = () => {
  const [teacher1, setTeacher1] = useState("")
  const [teacher2, setTeacher2] = useState("")
  const [student1, setStudent1] = useState("")
  const [student2, setStudent2] = useState("")
  const [errorMessage1, setErrorMessage1] = useState("")
  const [errorMessage2, setErrorMessage2] = useState("")

  const handleChangeTeacher = (value: string, isFirst: boolean) => {
    if (isFirst) {
      setTeacher1(value)
      validateSelection(
        value,
        teacher2,
        "講師1と講師2は異なる値を選択してください",
        setErrorMessage1,
      )
    } else {
      setTeacher2(value)
      validateSelection(
        value,
        teacher1,
        "講師1と講師2は異なる値を選択してください",
        setErrorMessage1,
      )
    }
  }

  const handleChangeStudent = (value: string, isFirst: boolean) => {
    if (isFirst) {
      setStudent1(value)
      validateSelection(
        value,
        student2,
        "代表と副代表は異なる値を選択してください",
        setErrorMessage2,
      )
    } else {
      setStudent2(value)
      validateSelection(
        value,
        student1,
        "代表と副代表は異なる値を選択してください",
        setErrorMessage2,
      )
    }
  }

  return (
    <VStack gap={0} w="full" h="full">
      <Center w="full" h="40" backgroundColor="gray.100">
        <VStack alignItems="center" gap={0}>
          <CameraIcon size="9xl" color="gray" />
          <Text color="gray" size="xl">
            ヘッダー画像
          </Text>
        </VStack>
      </Center>
      <VStack p="md" maxW="5xl" m="auto" gap="lg" flexGrow={1}>
        <Heading as="h1" size="lg">
          サークル編集
        </Heading>
        <form onSubmit={(e) => e.preventDefault()}>
          <VStack px="md">
            <FormControl
              isRequired
              display="flex"
              flexDirection={{ base: "row", md: "column" }}
              gap={{ base: "2xl", md: "md" }}
              maxW="2xl"
            >
              <Label flexGrow={1}>サークル名</Label>
              <Input
                type="text"
                w={{ base: "md", md: "full" }}
                placeholder="サークル名を入力"
              />
            </FormControl>
            <FormControl
              display="flex"
              flexDirection={{ base: "row", md: "column" }}
              gap={{ base: "2xl", md: "md" }}
              maxW="2xl"
            >
              <Label flexGrow={1}>講師１</Label>
              <Select
                w={{ base: "md", md: "full" }}
                placeholder="講師を選択"
                items={teachers}
                onChange={(value) => handleChangeTeacher(value, true)}
              />
            </FormControl>
            <FormControl
              display="flex"
              flexDirection={{ base: "row", md: "column" }}
              gap={{ base: "2xl", md: "md" }}
              maxW="2xl"
            >
              <Label flexGrow={1}>講師２</Label>
              <Select
                w={{ base: "md", md: "full" }}
                placeholder="講師を選択"
                items={teachers}
                onChange={(value) => handleChangeTeacher(value, false)}
              />
            </FormControl>
            {errorMessage1 && <Text color="red">{errorMessage1}</Text>}
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
            <FormControl
              display="flex"
              flexDirection={{ base: "row", md: "column" }}
              gap={{ base: "2xl", md: "md" }}
              maxW="2xl"
            >
              <Label flexGrow={1}>代表</Label>
              <Select
                w={{ base: "md", md: "full" }}
                placeholder="代表を選択"
                items={students}
                onChange={(value) => handleChangeStudent(value, true)}
              />
            </FormControl>
            <FormControl
              display="flex"
              flexDirection={{ base: "row", md: "column" }}
              gap={{ base: "2xl", md: "md" }}
              maxW="2xl"
            >
              <Label flexGrow={1}>副代表</Label>
              <Select
                w={{ base: "md", md: "full" }}
                placeholder="副代表を選択"
                items={students}
                onChange={(value) => handleChangeStudent(value, false)}
              />
            </FormControl>
            {errorMessage2 && <Text color="red">{errorMessage2}</Text>}
            <Center gap="md" justifyContent="end">
              <Button as={Link} href="/circles">
                キャンセル
              </Button>
              <Button type="submit">更新</Button>
            </Center>
          </VStack>
        </form>
      </VStack>
    </VStack>
  )
}

export default CircleEdit
