import {
  BellPlusIcon,
  MessageCircleMoreIcon,
  PlusIcon,
} from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@yamada-ui/react"
import Link from "next/link"
import { CircleMembershipButton } from "./circle-membership-button"
import type { getCircleById } from "@/actions/circle/fetch-circle"
import { handlingTab } from "@/utils/format"
interface CircleDetailButtonProps {
  tabKey: string
  isAdmin: boolean
  isMember: boolean
  circle: Awaited<ReturnType<typeof getCircleById>>
  userId: string
}
export const CircleDetailButton: FC<CircleDetailButtonProps> = ({
  tabKey,
  isAdmin,
  isMember,
  circle,
  userId,
}) => {
  switch (handlingTab(tabKey)) {
    case 0: {
      return isMember ? (
        <Button
          as={Link}
          href={`/circles/${circle?.id}/activities/new`}
          leftIcon={<PlusIcon />}
          colorScheme="riverBlue"
        >
          追加
        </Button>
      ) : (
        <CircleMembershipButton
          circleId={circle?.id || ""}
          userId={userId}
          isAdmin={!!isAdmin}
          isMember={!!isMember}
        />
      )
    }
    case 1: {
      return isMember ? (
        <Button
          as={Link}
          href={`/circles/${circle?.id}/album/create`}
          leftIcon={<PlusIcon />}
          colorScheme="riverBlue"
        >
          作成
        </Button>
      ) : (
        <CircleMembershipButton
          circleId={circle?.id || ""}
          userId={userId}
          isAdmin={!!isAdmin}
          isMember={!!isMember}
        />
      )
    }
    case 2: {
      return isMember ? (
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<PlusIcon fontSize="2xl" />}
            colorScheme="riverBlue"
          >
            作成
          </MenuButton>
          <MenuList>
            <MenuItem
              icon={<BellPlusIcon fontSize="2xl" />}
              as={Link}
              href={`/circles/${circle?.id}/announcement/create`}
            >
              お知らせ
            </MenuItem>
            <MenuItem
              icon={<MessageCircleMoreIcon fontSize="2xl" />}
              as={Link}
              href={`/circles/${circle?.id}/thread/create`}
            >
              スレッド
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <CircleMembershipButton
          circleId={circle?.id || ""}
          userId={userId}
          isAdmin={!!isAdmin}
          isMember={!!isMember}
        />
      )
    }
    case 3: {
      return (
        <CircleMembershipButton
          circleId={circle?.id || ""}
          userId={userId}
          isAdmin={!!isAdmin}
          isMember={!!isMember}
        />
      )
    }
    default: {
      return (
        <CircleMembershipButton
          circleId={circle?.id || ""}
          userId={userId}
          isAdmin={!!isAdmin}
          isMember={!!isMember}
        />
      )
    }
  }
}
