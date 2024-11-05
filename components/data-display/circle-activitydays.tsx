"use client"
import { MonthPicker } from "@yamada-ui/calendar"
import { EllipsisIcon, PlusIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import {
  Button,
  Card,
  CardBody,
  Center,
  GridItem,
  HStack,
  IconButton,
  Loading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useAsync,
  VStack,
} from "@yamada-ui/react"
import "dayjs/locale/ja"
import { useState } from "react"
import { fetchActivitiesByMonth } from "@/actions/circle/fetch-activity"

interface CircleActivitydays {
  isAdmin?: boolean
  userRole:
    | {
        id: number
        roleName: string
      }
    | undefined
  userId: string
}

export const CircleActivitydays: FC<CircleActivitydays> = ({
  userRole,
  isAdmin,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(new Date())
  const { value: activitys, loading } = useAsync(async () => {
    if (!currentMonth) return
    const { events } = await fetchActivitiesByMonth(currentMonth)
    return events
  }, [currentMonth])

  const displayTime = (date: Date) =>
    `${date.getHours()}:${zeroPadding(date.getMinutes())}`
  const zeroPadding = (min: number) => (10 > min ? `0${min}` : min)

  return (
    <VStack>
      <HStack justifyContent="space-between">
        <MonthPicker
          w="md"
          locale="ja"
          defaultValue={currentMonth}
          onChange={setCurrentMonth}
        />
        <IconButton icon={<PlusIcon />} />
      </HStack>
      <VStack>
        {loading ? (
          <Center w="full" h="full">
            <Loading fontSize="xl" />
          </Center>
        ) : activitys && activitys.length > 0 ? (
          activitys?.map((activity) => (
            <GridItem key={activity.id}>
              <Card variant="outline">
                <CardBody>
                  <HStack justifyContent="space-between" w="full">
                    <HStack>
                      <Card variant="outline" padding="sm" w="10" as={Center}>
                        {activity.activityDay.getDate()}
                      </Card>
                      <Text>{activity.title}</Text>
                    </HStack>

                    <HStack>
                      <Text>{activity.location}教室</Text>
                      <Text>
                        {displayTime(activity.startTime)}～
                        {displayTime(activity.endTime)}
                      </Text>
                      {isAdmin &&
                      userRole?.id !== undefined &&
                      [0, 1].includes(userRole.id) ? (
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<EllipsisIcon fontSize="2xl" />}
                            variant="ghost"
                            isRounded
                          />
                          <MenuList>
                            <MenuItem>編集</MenuItem>
                            <MenuItem color="red">削除</MenuItem>
                          </MenuList>
                        </Menu>
                      ) : (
                        <Button>参加</Button>
                      )}
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            </GridItem>
          ))
        ) : (
          <Text>活動がありません</Text>
        )}
      </VStack>
    </VStack>
  )
}
