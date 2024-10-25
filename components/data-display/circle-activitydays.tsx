"use client"
import { MonthPicker } from "@yamada-ui/calendar"
import { Car, PlusIcon } from "@yamada-ui/lucide"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import type { FC } from "@yamada-ui/react"
import { Card, CardBody, Flex, GridItem, HStack, IconButton, Text, VStack } from "@yamada-ui/react"
import "dayjs/locale/ja"

const activitys = [
                    ["7","活動日","402","16:00","18:00",],
                    ["8","ミーティング","402","16:00","18:00",],
                    ["12","活動日","402","16:00","18:00",],
                    ["14","ミーティング","402","16:00","18:00",],
                  ]; //活動日、タイトル、教室番号、開始時間、終了時間

export const CircleActivitydays: FC = () => {
  return (
    <VStack>
      <HStack justifyContent="space-between">
        <MonthPicker w="md" locale="ja" />
        <IconButton icon={<PlusIcon />} />
      </HStack>
      <VStack>
        {activitys.map(row =>
        <GridItem >
          <Card variant="outline">
            <CardBody>
                     
              <HStack>
                <Card variant="outline" padding="10px">{row[0]}</Card>
                <Text>{row[1]}</Text>
                <Text>{row[2]}教室</Text>
                <Text>{row[3]}～{row[4]}</Text>
                <IconButton icon={<HiOutlineDotsCircleHorizontal />} />
              </HStack>
            
            </CardBody>
          </Card>
        </GridItem>
        )}
      </VStack>
    </VStack>
  )
}
