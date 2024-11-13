import { EllipsisIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@yamada-ui/react"
import Link from "next/link"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import type { getActivityById } from "@/data/activity"

interface ActivityMenuButtonProps {
  isMember: boolean
  isAdmin: boolean
  userId: string
  circle: Awaited<ReturnType<typeof getCircleById>>
  activity: NonNullable<Awaited<ReturnType<typeof getActivityById>>>
  handleDelete: (activityId: number) => Promise<void>
  handleParticipation: (activityId: number) => Promise<void>
}

export const ActivityMenuButton: FC<ActivityMenuButtonProps> = ({
  isMember,
  isAdmin,
  userId,
  circle,
  activity,
  handleDelete,
  handleParticipation,
}) => {
  return isMember ? (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<EllipsisIcon fontSize="2xl" />}
        variant="ghost"
        isRounded
      />
      <MenuList>
        <MenuItem
          as={Link}
          href={`/circles/${circle?.id}/activities/${activity.id}/edit`}
        >
          編集
        </MenuItem>
        <MenuItem
          color="red"
          isDisabled={!isAdmin}
          onClick={() => handleDelete(activity.id)}
        >
          削除
        </MenuItem>
        {
          /* 参加者かどうか */
          activity.participants.some(
            (participant) => participant.userId === userId,
          ) ? (
            <MenuItem onClick={() => handleParticipation(activity.id)}>
              参加をキャンセル
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleParticipation(activity.id)}>
              参加
            </MenuItem>
          )
        }
      </MenuList>
    </Menu>
  ) : activity.participants.some(
      (participant) => participant.userId === userId,
    ) ? (
    <Button onClick={() => handleParticipation(activity.id)}>
      参加をキャンセル
    </Button>
  ) : (
    <Button onClick={() => handleParticipation(activity.id)}>参加</Button>
  )
}
