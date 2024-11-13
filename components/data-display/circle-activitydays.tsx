"use client"
import { MonthPicker } from "@yamada-ui/calendar"
import { PlusIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import {
  Card,
  CardBody,
  Center,
  GridItem,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Loading,
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
import { ActivityMenuButton } from "../forms/activity-menu-button"
import {
  fetchActivitiesByMonth,
  getActivityByIdActions,
} from "@/actions/circle/fetch-activity"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import { removeActivityAction } from "@/actions/circle/remove-activity"
import { toggleActivityParticipation } from "@/actions/circle/toggle-activity"
import type { getActivityById } from "@/data/activity"
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
  currentActivity?: Awaited<ReturnType<typeof getActivityById>>
}

export const CircleActivitydays: FC<CircleActivitydays> = ({
  userId,
  isAdmin,
  isMember,
  circle,
  currentActivity: activity,
}) => {
  const [currentActivity, setCurrentActivity] = useState(activity)
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(new Date())
  const [loading, { off: loadingOff, on: loadingOn }] = useBoolean(true)
  const fetchActivities = async () => {
    if (!currentMonth) return
    loadingOn()
    const { events } = await fetchActivitiesByMonth(
      currentMonth,
      circle?.id || "",
    )
    const newCrrrentActivity = await getActivityByIdActions(activity?.id || 0)
    loadingOff()
    setActivitys(events)
    setCurrentActivity(newCrrrentActivity)
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

    snack.closeAll()
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
      {currentActivity ? (
        <>
          <HStack justifyContent="end">
            {isMember ? (
              <IconButton
                as={Link}
                href={`/circles/${circle?.id}/activities/new`}
                icon={<PlusIcon />}
              />
            ) : undefined}
          </HStack>
          <Card w="full">
            <CardBody flexDir="row">
              <HStack>
                <Card variant="outline" padding="sm" w="10" as={Center}>
                  {currentActivity.activityDay.getDate()}
                </Card>
              </HStack>
              <VStack>
                <HStack justifyContent="space-between">
                  <Text>{currentActivity.title}</Text>
                  <ActivityMenuButton
                    userId={userId}
                    isMember={!!isMember}
                    isAdmin={!!isAdmin}
                    circle={circle}
                    activity={currentActivity}
                    handleParticipation={handleParticipation}
                    handleDelete={handleDelete}
                  />
                </HStack>
                <HStack
                  flexDir={{ base: "row", md: "column" }}
                  alignItems={{ md: "start" }}
                >
                  <Text>内容:</Text>
                  <Text as="pre">{currentActivity.description}</Text>
                </HStack>
                <HStack
                  flexDir={{ base: "row", md: "column" }}
                  alignItems={{ md: "start" }}
                >
                  <HStack
                    flexDir={{ base: "row", md: "column" }}
                    alignItems={{ md: "start" }}
                  >
                    <Text>活動時間:</Text>
                    <Text>
                      {displayTime(currentActivity.startTime)}
                      {currentActivity.endTime
                        ? `～${displayTime(currentActivity.endTime)}`
                        : undefined}
                    </Text>
                  </HStack>
                  <HStack
                    flexDir={{ base: "row", md: "column" }}
                    alignItems={{ md: "start" }}
                  >
                    <Text>活動場所:</Text>
                    <Text>{currentActivity.location}</Text>
                  </HStack>
                </HStack>
                <HStack
                  flexDir={{ base: "row", md: "column" }}
                  alignItems={{ md: "start" }}
                >
                  <Text>参加人数:</Text>
                  <Text>{currentActivity.participants.length}人</Text>
                </HStack>
                <HStack
                  flexDir={{ base: "row", md: "column" }}
                  alignItems={{ md: "start" }}
                >
                  <Text>備考:</Text>
                  <Text>{currentActivity.notes}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </>
      ) : (
        <>
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
                  <Card variant="outline" as={LinkBox}>
                    <CardBody>
                      <HStack justifyContent="space-between" w="full">
                        <HStack
                          as={LinkOverlay}
                          href={`/circles/${circle?.id}/activities/${activity.id}`}
                        >
                          <Card
                            variant="outline"
                            padding="sm"
                            w="10"
                            as={Center}
                          >
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
                          <ActivityMenuButton
                            userId={userId}
                            isMember={!!isMember}
                            isAdmin={!!isAdmin}
                            circle={circle}
                            activity={activity}
                            handleParticipation={handleParticipation}
                            handleDelete={handleDelete}
                          />
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
        </>
      )}
    </VStack>
  )
}
