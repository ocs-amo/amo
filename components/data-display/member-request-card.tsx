"use client"

import type { AlertStatus, FC } from "@yamada-ui/react"
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Center,
  Dialog,
  GridItem,
  HStack,
  Text,
  useDisclosure,
} from "@yamada-ui/react"
import { useState } from "react"
import {
  handleMembershipRequestAction,
  type getMembershipRequests,
} from "@/actions/circle/membership-request"

interface MemberRequestCardProps {
  userId: string
  circleId: string
  member: NonNullable<
    Awaited<ReturnType<typeof getMembershipRequests>>["data"]
  >[number]
  fetchData: () => Promise<void>
  handleSnack: (title: string, status: AlertStatus) => string | number
}

export const MemberRequestCard: FC<MemberRequestCardProps> = ({
  userId,
  circleId,
  member,
  fetchData,
  handleSnack,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [confirmState, setConfirmState] = useState("")
  const requestType = member.requestType === "join" ? "join" : "withdrawal"
  const handleApproveConfirm = () => {
    onOpen()
    setConfirmState("approve")
  }
  const handleRejectConfirm = () => {
    onOpen()
    setConfirmState("reject")
  }
  const handleApprove = async () => {
    const { message, success } = await handleMembershipRequestAction(
      userId,
      circleId,
      member.id,
      requestType,
      "approve",
    )
    if (success) {
      handleSnack(message, "success")
      await fetchData()
    } else {
      handleSnack(message, "error")
    }
  }
  const handleReject = async () => {
    const { message, success } = await handleMembershipRequestAction(
      userId,
      circleId,
      member.id,
      requestType,
      "reject",
    )
    if (success) {
      handleSnack(message, "success")
      await fetchData()
    } else {
      handleSnack(message, "error")
    }
  }
  return (
    <GridItem w="full" rounded="md" as={Card}>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => {
          if (confirmState === "approve") {
            handleApprove()
          } else if (confirmState === "reject") {
            handleReject()
          }
          onClose()
        }}
        onCancel={onClose}
        cancel="キャンセル"
        success="OK"
      >
        {confirmState === "approve" ? "本当に承認しますか？" : undefined}
        {confirmState === "reject" ? "本当に拒否しますか？" : undefined}
      </Dialog>
      <CardBody>
        <HStack
          as={Center}
          justifyContent="space-between"
          w="full"
          flexWrap="wrap"
        >
          <HStack flexWrap="wrap">
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
            <Button
              variant="outline"
              colorScheme="primary"
              onClick={handleApproveConfirm}
            >
              承認
            </Button>
            <Button
              variant="outline"
              colorScheme="danger"
              onClick={handleRejectConfirm}
            >
              拒否
            </Button>
          </HStack>
        </HStack>
      </CardBody>
    </GridItem>
  )
}
