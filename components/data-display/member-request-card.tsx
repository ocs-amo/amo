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
  Text,
} from "@yamada-ui/react"
import type { getMembershipRequests } from "@/actions/circle/membership-request"

interface MemberRequestCardProps {
  member: NonNullable<
    Awaited<ReturnType<typeof getMembershipRequests>>["data"]
  >[number]
}

export const MemberRequestCard: FC<MemberRequestCardProps> = ({ member }) => {
  const handleApprove = async () => {
    console.log("handleApprove")
  }
  const handleReject = async () => {
    console.log("handleReject")
  }
  return (
    <GridItem w="full" rounded="md" as={Card}>
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
            <Button
              variant="outline"
              colorScheme="primary"
              onClick={handleApprove}
            >
              承認
            </Button>
            <Button
              variant="outline"
              colorScheme="danger"
              onClick={handleReject}
            >
              拒否
            </Button>
          </HStack>
        </HStack>
      </CardBody>
    </GridItem>
  )
}
