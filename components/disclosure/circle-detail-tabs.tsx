"use client"
import type { FC } from "@yamada-ui/react"
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Center,
  GridItem,
  HStack,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@yamada-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { getMembershipRequests } from "@/actions/circle/membership-request"
import type { getCircleById } from "@/data/circle"

interface CircleDetailTabsProps {
  circle: Awaited<ReturnType<typeof getCircleById>>
  membershipRequests: Awaited<ReturnType<typeof getMembershipRequests>>
  tabKey?: string
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
}) => {
  const [tabIndex, setTabIndex] = useState(handlingTab(tabKey || ""))
  const { data } = membershipRequests
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
        <Tab>メンバー一覧</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>活動日程</TabPanel>
        <TabPanel>画像</TabPanel>
        <TabPanel>掲示板</TabPanel>
        <TabPanel>
          <SimpleGrid w="full" columns={{ base: 2, md: 1 }} gap="md">
            {data?.map((member) => (
              <GridItem key={member.id} w="full" rounded="md" as={Card}>
                <CardBody>
                  <HStack as={Center} justifyContent="space-between" w="full">
                    <HStack>
                      <Avatar src={member.iconImagePath || ""} />
                      {member.requestType === "join" ? (
                        <Badge colorScheme="success">入会</Badge>
                      ) : (
                        <Badge colorScheme="danger">退会</Badge>
                      )}
                      <Text>{member.userName}</Text>
                      <Text>{member.studentNumber}</Text>
                    </HStack>
                    <HStack>
                      <Button variant="outline" colorScheme="primary">
                        承認
                      </Button>
                      <Button variant="outline" colorScheme="danger">
                        拒否
                      </Button>
                    </HStack>
                  </HStack>
                </CardBody>
              </GridItem>
            ))}
            {circle?.members?.map((member) => (
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
