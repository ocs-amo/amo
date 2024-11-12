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
  Snacks,
  Text,
  useBoolean,
  useSafeLayoutEffect,
  useSnacks,
  VStack,
} from "@yamada-ui/react"
import "dayjs/locale/ja"
import Link from "next/link"
import { useState } from "react"
import { fetchActivitiesByMonth } from "@/actions/circle/fetch-activity"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import { removeActivityAction } from "@/actions/circle/remove-activity"
import { toggleActivityParticipation } from "@/actions/circle/toggle-activity"
import { zeroPadding } from "@/utils/format"

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
  const [loading, { off: loadingOff }] = useBoolean(true)
  const fetchActivities = async () => {
    if (!currentMonth) return
    const { events } = await fetchActivitiesByMonth(
      currentMonth,
      circle?.id || "",
    )
    loadingOff()
    setActivitys(events)
  }
  const [activitys, setActivitys] = useState<
    Awaited<ReturnType<typeof fetchActivitiesByMonth>>["events"]
  >([])
  useSafeLayoutEffect(() => {
    fetchActivities()
  }, [currentMonth])
  const { snack, snacks } = useSnacks()

  const displayTime = (date: Date) =>
    `${date.getHours()}:${zeroPadding(date.getMinutes())}`

  const handleDelete = async (activityId: number) => {
    if (!isAdmin) return
    const { success, error } = await removeActivityAction(
      activityId,
      circle?.id || "",
      userId,
    )

    if (success) {
      snack({
        title: "削除しました。",
        status: "success",
      })
      fetchActivities()
    } else {
      snack({ title: error || "エラー", status: "error" })
    }
  }

  const handleParticipation = async (activityId: number) => {
    const { success, action, error } = await toggleActivityParticipation(
      activityId,
      userId,
    )

    snack.closeAll()
    if (success) {
      snack({
        title: action === "joined" ? "参加しました。" : "キャンセルしました。",
        status: "success",
      })
      fetchActivities()
    } else {
      snack({ title: error || "エラー", status: "error" })
    }
  }

  return (
    <VStack>
      <Snacks snacks={snacks} />
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
                            <MenuItem
                              as={Link}
                              href={`/circles/${circle?.id}/activities/${activity.id}/edit`}
                            >
                              編集
                            </MenuItem>
                            <MenuItem
                              color="red"
                              isDisabled={!isAdmin}
                              onClick={() => handleDelete(activity.id)}
                            >
                              削除
                            </MenuItem>
                            {
                              /* 参加者かどうか */
                              activity.participants.some(
                                (participant) => participant.userId === userId,
                              ) ? (
                                <MenuItem
                                  onClick={() =>
                                    handleParticipation(activity.id)
                                  }
                                >
                                  参加をキャンセル
                                </MenuItem>
                              ) : (
                                <MenuItem
                                  onClick={() =>
                                    handleParticipation(activity.id)
                                  }
                                >
                                  参加
                                </MenuItem>
                              )
                            }
                          </MenuList>
                        </Menu>
                      ) : activity.participants.some(
                          (participant) => participant.userId === userId,
                        ) ? (
                        <Button
                          onClick={() => handleParticipation(activity.id)}
                        >
                          参加をキャンセル
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleParticipation(activity.id)}
                        >
                          参加
                        </Button>
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
