"use client"
import { MonthPicker } from "@yamada-ui/calendar"
import { PlusIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import {
  Card,
  CardBody,
  GridItem,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@yamada-ui/react"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import "dayjs/locale/ja"
import { date } from "zod"

const activitys = [
  {
    date: "7",
    title: "活動日",
    class: "402",
    start: "16:00",
    end: "18:00",
  },
  {
    date: "8",
    title: "ミーティング",
    class: "402",
    start: "16:00",
    end: "18:00",
  },
  {
    date: "12",
    title: "活動日",
    class: "402",
    start: "16:00",
    end: "18:00",
  },
  {
    date: "14",
    title: "ミーティング",
    class: "402",
    start: "16:00",
    end: "18:00",
  },
] //活動日、タイトル、教室番号、開始時間、終了時間

export const CircleActivitydays: FC = () => {
  return (
    <VStack>
      <HStack justifyContent="space-between">
        <MonthPicker w="md" locale="ja" />
        <IconButton icon={<PlusIcon />} />
      </HStack>
      <VStack>
        {activitys.map((row) => (
          <GridItem key={row.date}>
            <Card variant="outline">
              <CardBody>
                <HStack justifyContent="space-between" w="full">
                  <HStack>
                    <Card variant="outline" padding="10px">
                      {row.date}
                    </Card>
                    <Text>{row.title}</Text>
                  </HStack>

                  <HStack>
                    <Text>{row.class}教室</Text>
                    <Text>
                      {row.start}～{row.end}
                    </Text>
                    <IconButton icon={<HiOutlineDotsCircleHorizontal />} />
                  </HStack>
                </HStack>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </VStack>
    </VStack>
  )
}
