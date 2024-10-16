"use client"
import type {
  FC} from "@yamada-ui/react";
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
import type { getMemberByCircleId } from "@/data/circle"

interface CircleDetailTabsProps {
  members: Awaited<ReturnType<typeof getMemberByCircleId>>
}

export const CircleDetailTabs: FC<CircleDetailTabsProps> = ({ members }) => {
  return (
    <Tabs>
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
            {members?.map((member) => (
              <GridItem key={member.id} w="full" rounded="md" as={Card}>
                <CardBody>
                  <HStack as={Center}>
                    <Avatar src={member.iconImagePath || ""} />
                    <Badge>代表</Badge>
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
