"use client"
import type { AlertStatus, FC } from "@yamada-ui/react"
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  Center,
  GridItem,
  HStack,
  Indicator,
  SimpleGrid,
  Snacks,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useSnacks,
} from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MemberRequestCard } from "../data-display/member-request-card"
import { getMembershipRequests } from "@/actions/circle/membership-request"
import { getCircleById } from "@/data/circle"

interface CircleDetailTabsProps {
  circle: Awaited<ReturnType<typeof getCircleById>>
  membershipRequests: Awaited<ReturnType<typeof getMembershipRequests>>
  tabKey?: string
  userId: string
  isAdmin?: boolean
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
}) => {
  const [tabIndex, setTabIndex] = useState(handlingTab(tabKey || ""))
  const { data } = membershipRequests
  const [members, setMembers] = useState<
    NonNullable<Awaited<ReturnType<typeof getCircleById>>>["members"]
  >(circle?.members)
  const [requests, setRequests] =
    useState<Awaited<ReturnType<typeof getMembershipRequests>>["data"]>(data)
  const { snack, snacks } = useSnacks()
  const handleSnack = (title: string, status: AlertStatus) =>
    snack({ title, status })
  const fetchData = async () => {
    if (circle?.id) {
      setMembers((await getCircleById(circle.id))?.members)
      setRequests((await getMembershipRequests(userId, circle.id)).data)
    }
  }

  const router = useRouter()
  const handleChange = (index: number) => {
    setTabIndex(index)
    switch (index) {
      case 0:
        router.push(`/circles/${circle?.id}/days`)
        break
      case 1:
        router.push(`/circles/${circle?.id}/images`)
        break
      case 2:
        router.push(`/circles/${circle?.id}/notifications`)
        break
      case 3:
        router.push(`/circles/${circle?.id}/members`)
        break

      default:
        break
    }
  }
  return (
    <Tabs index={tabIndex} onChange={handleChange}>
      <TabList>
        <Tab>活動日程</Tab>
        <Tab>画像</Tab>
        <Tab>掲示板</Tab>
        <Tab>
          <Indicator
            colorScheme="danger"
            size="sm"
            placement="right"
            offset={-1.5}
            label={requests?.length}
            isDisabled={!requests?.length || !isAdmin}
          >
            メンバー一覧
          </Indicator>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>活動日程</TabPanel>
        <TabPanel>画像</TabPanel>
        <TabPanel>掲示板</TabPanel>
        <TabPanel>
          <Snacks snacks={snacks} />
          <SimpleGrid w="full" columns={{ base: 2, md: 1 }} gap="md">
            {requests?.map((member) => (
              <MemberRequestCard
                key={member.id}
                member={member}
                userId={userId}
                circleId={circle?.id || ""}
                fetchData={fetchData}
                handleSnack={handleSnack}
              />
            ))}
            {members?.map((member) => (
              <GridItem key={member.id} w="full" rounded="md" as={Card}>
                <CardBody>
                  <HStack as={Center}>
                    <Avatar src={member.iconImagePath || ""} />
                    {member.role ? (
                      <Badge>{member.role.roleName}</Badge>
                    ) : (
                      <Badge visibility="hidden">一般</Badge>
                    )}
                    <Text>{member.name}</Text>
                    <Text>{member.studentNumber}</Text>
                  </HStack>
                </CardBody>
              </GridItem>
            ))}
          </SimpleGrid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
