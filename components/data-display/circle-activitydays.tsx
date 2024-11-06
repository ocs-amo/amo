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
import Link from "next/link"
import { useState } from "react"
import { fetchActivitiesByMonth } from "@/actions/circle/fetch-activity"
import type { getCircleById } from "@/data/circle"

interface CircleActivitydays {
  isAdmin?: boolean
  isMember?: boolean
  userRole:
    | {
        id: number
        roleName: string
      }
    | undefined
  userId: string
  circle: Awaited<ReturnType<typeof getCircleById>>
}

export const CircleActivitydays: FC<CircleActivitydays> = ({
  userId,
  isAdmin,
  isMember,
  circle,
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
        {isMember ? (
          <IconButton
            as={Link}
            href={`/circles/${circle?.id}/activities/new`}
            icon={<PlusIcon />}
          />
        ) : undefined}
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
                      <Text>{activity.location}</Text>
                      <Text>
                        {displayTime(activity.startTime)}
                        {activity.endTime
                          ? `～${displayTime(activity.endTime)}`
                          : undefined}
                      </Text>
                      <Text>{activity.participants.length}人</Text>
                      {isMember ? (
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<EllipsisIcon fontSize="2xl" />}
                            variant="ghost"
                            isRounded
                          />
                          <MenuList>
                            <MenuItem>編集</MenuItem>
                            <MenuItem color="red" isDisabled={!isAdmin}>
                              削除
                            </MenuItem>
                            {
                              /* 参加者かどうか */
                              activity.participants.some(
                                (participant) => participant.userId === userId,
                              ) ? (
                                <MenuItem>参加をキャンセル</MenuItem>
                              ) : (
                                <MenuItem>参加</MenuItem>
                              )
                            }
                          </MenuList>
                        </Menu>
                      ) : activity.participants.some(
                          (participant) => participant.userId === userId,
                        ) ? (
                        <Button>参加をキャンセル</Button>
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
