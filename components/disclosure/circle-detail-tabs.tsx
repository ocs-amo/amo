"use client"
import { EllipsisIcon } from "@yamada-ui/lucide"
import type { AlertStatus, FC } from "@yamada-ui/react"
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  Center,
  GridItem,
  HStack,
  IconButton,
  Indicator,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
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
import Link from "next/link"
import { MemberRequestCard } from "../data-display/member-request-card"
import type { getMembershipRequests } from "@/actions/circle/membership-request"
import type { getCircleById } from "@/data/circle"

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
  const userRole = circle?.members?.find((member) => member.id === userId)?.role
  const tabIndex = handlingTab(tabKey || "")
  const { data } = membershipRequests
  const { snack, snacks } = useSnacks()
  const handleSnack = (title: string, status: AlertStatus) =>
    snack({ title, status })

  return (
    <Tabs index={tabIndex}>
      <TabList overflowX="auto">
        <Tab as={Link} href={`/circles/${circle?.id}/days`}>
          活動日程
        </Tab>
        <Tab as={Link} href={`/circles/${circle?.id}/images`}>
          画像
        </Tab>
        <Tab as={Link} href={`/circles/${circle?.id}/notifications`}>
          掲示板
        </Tab>
        <Tab as={Link} href={`/circles/${circle?.id}/members`}>
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
        <TabPanel>活動日程</TabPanel>
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
              <GridItem key={member.id} w="full" rounded="md" as={Card}>
                <CardBody>
                  <HStack
                    as={Center}
                    w="full"
                    flexWrap="wrap"
                    justifyContent="space-between"
                  >
                    <HStack flexWrap="wrap">
                      <Avatar src={member.iconImagePath || ""} />
                      {member.role ? (
                        <Badge>{member.role.roleName}</Badge>
                      ) : (
                        <Badge visibility="hidden">一般</Badge>
                      )}
                      <Text>{member.name}</Text>
                      <Text>{member.studentNumber}</Text>
                    </HStack>
                    {isAdmin &&
                    userId !== member.id &&
                    member?.role?.id !== 0 ? (
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<EllipsisIcon fontSize="2xl" />}
                          variant="outline"
                          isRounded
                        />
                        <MenuList>
                          {/* 代表のメニューオプション */}
                          {userRole?.id === 0 && (
                            <>
                              <MenuItem
                                // onClick={() => handleRoleChange(member.id, "代表")}
                                isDisabled={member.role?.id === 0}
                              >
                                代表
                              </MenuItem>
                              <MenuItem
                                // onClick={() => handleRoleChange(member.id, "副代表")}
                                isDisabled={member.role?.id === 1}
                              >
                                副代表
                              </MenuItem>
                              <MenuItem
                                // onClick={() => handleRoleChange(member.id, "一般")}
                                isDisabled={!member.role?.id}
                              >
                                一般
                              </MenuItem>
                              <MenuDivider />
                              <MenuItem
                                color="red"
                                // onClick={() => handleRemoveMember(member.id)}
                              >
                                退会
                              </MenuItem>
                            </>
                          )}

                          {/* 副代表のメニューオプション */}
                          {userRole?.id === 1 && (
                            <>
                              <MenuItem
                                // onClick={() => handleRoleChange(member.id, "副代表")}
                                isDisabled={member.role?.id === 1}
                              >
                                副代表
                              </MenuItem>
                              <MenuItem
                                // onClick={() => handleRoleChange(member.id, "一般")}
                                isDisabled={!member.role?.id}
                              >
                                一般
                              </MenuItem>
                              <MenuDivider />
                              <MenuItem
                                color="red"
                                // onClick={() => handleRemoveMember(member.id)}
                              >
                                退会
                              </MenuItem>
                            </>
                          )}
                        </MenuList>
                      </Menu>
                    ) : undefined}
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
