"use client"
import { MonthPicker } from "@yamada-ui/calendar"
import type { FC } from "@yamada-ui/react"
import {
  Card,
  CardBody,
  Center,
  GridItem,
  HStack,
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
import { ActivityCard } from "./activity-card"
import {
  fetchActivitiesByMonth,
  getActivityByIdActions,
} from "@/actions/circle/fetch-activity"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import { removeActivityAction } from "@/actions/circle/remove-activity"
import { toggleActivityParticipation } from "@/actions/circle/toggle-activity"
import type { getActivityById } from "@/data/activity"
import { displayTime } from "@/utils/format"

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
    <VStack w="full" h="full">
      <Snacks snacks={snacks} />
      {currentActivity ? (
        <ActivityCard
          userId={userId}
          isAdmin={!!isAdmin}
          isMember={!!isMember}
          circle={circle}
          currentActivity={currentActivity}
          handleParticipation={handleParticipation}
          handleDelete={handleDelete}
        />
      ) : (
        <>
          <HStack justifyContent="start">
            <MonthPicker
              w="md"
              locale="ja"
              defaultValue={currentMonth}
              onChange={setCurrentMonth}
              containerProps={{
                bg: "white",
              }}
            />
          </HStack>
          <VStack w="full" h="full">
            {loading ? (
              <Center w="full" h="full">
                <Loading fontSize="xl" />
              </Center>
            ) : activitys && activitys.length > 0 ? (
              activitys?.map((activity) => (
                <GridItem key={activity.id}>
                  <Card variant="outline" as={LinkBox} bg="white">
                    <CardBody>
                      <HStack justifyContent="space-between" w="full">
                        <LinkOverlay
                          justifyContent="center"
                          alignItems="center"
                          gap="md"
                          as={Link}
                          display="flex"
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
                          <Text lineClamp={1}>{activity.title}</Text>
                        </LinkOverlay>

                        <HStack>
                          <Text lineClamp={1}>{activity.location}</Text>
                          <Text>
                            {displayTime(activity.startTime)}
                            {activity.endTime
                              ? `～${displayTime(activity.endTime)}`
                              : undefined}
                          </Text>
                          <Text whiteSpace="nowrap">
                            {activity.participants.length}人
                          </Text>
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
              <Center w="full" h="full">
                <Text>活動がありません</Text>
              </Center>
            )}
          </VStack>
        </>
      )}
    </VStack>
  )
}
