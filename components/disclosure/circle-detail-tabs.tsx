"use client"

import type { FC } from "@yamada-ui/react"
import {
  Indicator,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@yamada-ui/react"
import Link from "next/link"
import { CircleActivitydays } from "../data-display/circle-activitydays"
import { CircleMembers } from "../data-display/circle-members"
import { CircleThreads } from "../data-display/circle-threads"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import { type getMembershipRequests } from "@/actions/circle/membership-request"
import type { getActivityById } from "@/data/activity"
import type { getAnnouncementById } from "@/data/announcement"
import type { getThreadById } from "@/data/thread"
import { handlingTab } from "@/utils/format"

interface CircleDetailTabsProps {
  circle: Awaited<ReturnType<typeof getCircleById>>
  membershipRequests: Awaited<ReturnType<typeof getMembershipRequests>>
  tabKey?: string
  userId: string
  isAdmin?: boolean
  isMember?: boolean
  currentActivity?: Awaited<ReturnType<typeof getActivityById>>
  currentThread?: Awaited<ReturnType<typeof getThreadById>>
  currentAnnouncement?: Awaited<ReturnType<typeof getAnnouncementById>>
  fetchData: () => Promise<void>
}

export const CircleDetailTabs: FC<CircleDetailTabsProps> = ({
  circle,
  tabKey,
  membershipRequests,
  userId,
  isAdmin,
  isMember,
  currentActivity,
  currentThread,
  currentAnnouncement,
  fetchData,
}) => {
  const userRole = circle?.members?.find((member) => member.id === userId)?.role
  const tabIndex = handlingTab(tabKey || "")
  const { data } = membershipRequests

  return (
    <Tabs index={tabIndex}>
      <TabList overflowX="auto" overflowY="hidden">
        <Tab
          flexShrink={0}
          as={Link}
          href={`/circles/${circle?.id}/activities`}
        >
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
            isMember={isMember}
            currentActivity={currentActivity}
            circle={circle}
          />
        </TabPanel>
        <TabPanel>画像</TabPanel>

        <TabPanel>
          <CircleThreads
            userId={userId}
            isAdmin={isAdmin}
            isMember={isMember}
            circle={circle}
            currentThread={currentThread}
            currentAnnouncement={currentAnnouncement}
          />
        </TabPanel>

        <TabPanel>
          <CircleMembers
            userId={userId}
            userRole={userRole}
            isAdmin={!!isAdmin}
            circle={circle}
            membershipRequests={membershipRequests}
            fetchData={fetchData}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
