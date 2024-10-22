"use client"
import type { FC } from "@yamada-ui/react"
import {
  Avatar,
  Badge,
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
import type { getCircleById } from "@/data/circle"

interface CircleDetailTabsProps {
  circle: Awaited<ReturnType<typeof getCircleById>>
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
}) => {
  const [tabIndex, setTabIndex] = useState(handlingTab(tabKey || ""))
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
