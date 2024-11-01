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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@yamada-ui/react"
import { useState, type FC } from "react"
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null)
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null)

  // 権限変更モーダルを開く
  const openConfirmDialog = (memberId: string, memberName: string, roleId: number, roleName: string) => {
    setSelectedRole(roleId)
    setSelectedMemberId(memberId)
    setSelectedMemberName(memberName)
    setSelectedRoleName(roleName)
    onOpen()
  }

  // 権限変更を確定
  const confirmRoleChange = async () => {
    if (selectedMemberId && selectedRole !== null) {
      await handleRoleChange(selectedMemberId, selectedRole)
      onClose()
    }
  }
  
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
                      onClick={() => openConfirmDialog(member.id, member.name, 0, "代表")}
                      isDisabled={member.role?.id === 0}
                    >
                      代表
                    </MenuItem>
                    <MenuItem
                      onClick={() => openConfirmDialog(member.id, member.name, 1, "副代表")}
                      isDisabled={member.role?.id === 1}
                    >
                      副代表
                    </MenuItem>
                    <MenuItem
                      onClick={() => openConfirmDialog(member.id, member.name, 2, "一般")}
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
                      onClick={() => openConfirmDialog(member.id, member.name, 1, "副代表")}
                      isDisabled={member.role?.id === 1}
                    >
                      副代表
                    </MenuItem>
                    <MenuItem
                      onClick={() => openConfirmDialog(member.id, member.name, 2, "一般")}
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

          {/* 権限変更確認モーダル */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
              <ModalHeader>権限変更の確認</ModalHeader>
              <ModalBody>
                {selectedMemberName}さんの役割を「{selectedRoleName}」に変更しますか？
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>キャンセル</Button>
                <Button colorScheme="blue" onClick={confirmRoleChange} ml={3}>
                  確認
                </Button>
              </ModalFooter>
          </Modal>

        </HStack>
      </CardBody>
    </GridItem>
  )
}
