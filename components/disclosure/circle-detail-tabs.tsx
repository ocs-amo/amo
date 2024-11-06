"use client"
import type { AlertStatus, FC } from "@yamada-ui/react"
import {
  Indicator,
  SimpleGrid,
  Snacks,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useSnacks,
} from "@yamada-ui/react"
import Link from "next/link"
import { CircleActivitydays } from "../data-display/circle-activitydays"
import { MemberCard } from "../data-display/member-card"
import { MemberRequestCard } from "../data-display/member-request-card"
import {
  removeMember,
  type getMembershipRequests,
} from "@/actions/circle/membership-request"
import { changeMemberRole } from "@/actions/circle/update-role"
import type { getCircleById } from "@/data/circle"
import { useEffect } from "react"

interface CircleDetailTabsProps {
  circle: Awaited<ReturnType<typeof getCircleById>>
  membershipRequests: Awaited<ReturnType<typeof getMembershipRequests>>
  tabKey?: string
  userId: string
  isAdmin?: boolean
  fetchData: () => Promise<void>
}

const handlingTab = (key: string) => {
  switch (key) {
    case "days":
      return 0
    case "images":
      return 1
    case "notifications":
      return 2
    case "members":
      return 3
    default:
      return 0
  }
}

export const CircleDetailTabs: FC<CircleDetailTabsProps> = ({
  circle,
  tabKey,
  membershipRequests,
  userId,
  isAdmin,
  fetchData,
}) => {
  useEffect(() => {
    document.title = tabKey + " - " + circle?.name;
  },[]);
  const userRole = circle?.members?.find((member) => member.id === userId)?.role
  const tabIndex = handlingTab(tabKey || "")
  const { data } = membershipRequests
  const { snack, snacks } = useSnacks()
  const handleSnack = (title: string, status: AlertStatus) => {
    snack.closeAll()
    snack({ title, status })
  }
  const handleRoleChange = async (
    targetMemberId: string,
    newRoleId: number,
  ) => {
    try {
      const { message, success } = await changeMemberRole({
        userId, // 現在のユーザーID
        circleId: circle?.id || "", // サークルID
        targetMemberId, // 変更対象のメンバーID
        newRoleId, // 新しい役職ID
      })
      if (success) {
        handleSnack(message, "success")
        await fetchData() // データを再フェッチ
      } else {
        handleSnack(message, "error")
      }
    } catch (error) {
      handleSnack(
        error instanceof Error ? error.message : "エラーが発生しました。",
        "error",
      )
    }
  }

  const handleRemoveMember = async (targetMemberId: string) => {
    try {
      const { message, success } = await removeMember({
        circleId: circle?.id || "",
        targetMemberId,
        userId,
      })
      if (success) {
        handleSnack(message, "success")
        await fetchData() // データを再フェッチ
      } else {
        handleSnack(message, "error")
      }
    } catch (error) {
      handleSnack(
        error instanceof Error ? error.message : "エラーが発生しました。",
        "error",
      )
    }
  }

  return (
    <Tabs index={tabIndex}>
      <TabList overflowX="auto" overflowY="hidden">
        <Tab flexShrink={0} as={Link} href={`/circles/${circle?.id}/days`}>
          活動日程
        </Tab>
        <Tab flexShrink={0} as={Link} href={`/circles/${circle?.id}/images`}>
          画像
        </Tab>
        <Tab
          flexShrink={0}
          as={Link}
          href={`/circles/${circle?.id}/notifications`}
        >
          掲示板
        </Tab>
        <Tab flexShrink={0} as={Link} href={`/circles/${circle?.id}/members`}>
          <Indicator
            colorScheme="danger"
            size="sm"
            placement="right"
            offset={-1.5}
            label={data?.length}
            isDisabled={!data?.length || !isAdmin}
          >
            メンバー一覧
          </Indicator>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <CircleActivitydays
            userId={userId}
            userRole={userRole}
            isAdmin={isAdmin}
          />
        </TabPanel>
        <TabPanel>画像</TabPanel>
        <TabPanel>掲示板</TabPanel>
        <TabPanel>
          <Snacks snacks={snacks} />
          <SimpleGrid w="full" columns={{ base: 2, md: 1 }} gap="md">
            {data?.map((member) => (
              <MemberRequestCard
                key={member.id}
                member={member}
                userId={userId}
                circleId={circle?.id || ""}
                fetchData={fetchData}
                handleSnack={handleSnack}
              />
            ))}
            {circle?.members?.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isAdmin={isAdmin}
                userId={userId}
                userRole={userRole}
                handleRoleChange={handleRoleChange}
                handleRemoveMember={handleRemoveMember}
              />
            ))}
          </SimpleGrid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
