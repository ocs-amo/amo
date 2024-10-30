"use client"
import { EllipsisIcon } from "@yamada-ui/lucide"
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  Center,
  GridItem,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@yamada-ui/react"
import type { FC } from "react"
import type { getCircleById } from "@/data/circle"

interface MemberCard {
  member: NonNullable<
    NonNullable<Awaited<ReturnType<typeof getCircleById>>>["members"]
  >[number]
  isAdmin?: boolean
  userRole:
    | {
        id: number
        roleName: string
      }
    | undefined
  userId: string
  handleRoleChange: (targetMemberId: string, newRoleId: number) => Promise<void>
  handleRemoveMember: (targetMemberId: string) => Promise<void>
}

export const MemberCard: FC<MemberCard> = ({
  member,
  isAdmin,
  userRole,
  userId,
  handleRoleChange,
  handleRemoveMember,
}) => {
  return (
    <GridItem w="full" rounded="md" as={Card}>
      <CardBody>
        <HStack
          as={Center}
          w="full"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <HStack flexWrap="wrap">
            <Avatar src={member.iconImagePath || ""} />
            <Badge>{member.role.roleName}</Badge>
            <Text>{member.name}</Text>
            <Text>{member.studentNumber}</Text>
          </HStack>
          {isAdmin && userId !== member.id && member?.role?.id !== 0 ? (
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
                      onClick={() => handleRoleChange(member.id, 0)}
                      isDisabled={member.role?.id === 0}
                    >
                      代表
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleRoleChange(member.id, 1)}
                      isDisabled={member.role?.id === 1}
                    >
                      副代表
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleRoleChange(member.id, 2)}
                      isDisabled={member.role?.id === 2}
                    >
                      一般
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      color="red"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      退会
                    </MenuItem>
                  </>
                )}

                {/* 副代表のメニューオプション */}
                {userRole?.id === 1 && (
                  <>
                    <MenuItem
                      onClick={() => handleRoleChange(member.id, 1)}
                      isDisabled={member.role?.id === 1}
                    >
                      副代表
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleRoleChange(member.id, 2)}
                      isDisabled={member.role?.id === 2}
                    >
                      一般
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      color="red"
                      onClick={() => handleRemoveMember(member.id)}
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
  )
}
