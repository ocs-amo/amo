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
      return (
        <>
          {isAdmin && (
            <Button
              colorScheme="riverBlue"
              as={Link}
              href={`/circles/${circle?.id}/edit`}
            >
              サークル編集
            </Button>
          )}
          {isMember ? (
            <Button
              position="fixed"
              bottom={{ base: 10, sm: 20 }}
              right={{ base: 10, sm: 5 }}
              zIndex={10}
              as={Link}
              href={`/circles/${circle?.id}/activities/new`}
              startIcon={<PlusIcon fontSize="2xl" />}
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
          )}
        </>
      )
    }
    case 1: {
      return (
        <>
          {isAdmin && (
            <Button
              colorScheme="riverBlue"
              as={Link}
              href={`/circles/${circle?.id}/edit`}
            >
              サークル編集
            </Button>
          )}
          {isMember ? (
            <Button
              position="fixed"
              bottom={{ base: 10, sm: 20 }}
              right={{ base: 10, sm: 5 }}
              zIndex={10}
              as={Link}
              href={`/circles/${circle?.id}/album/create`}
              startIcon={<PlusIcon fontSize="2xl" />}
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
          )}
        </>
      )
    }
    case 2: {
      return (
        <>
          {isAdmin && (
            <Button
              colorScheme="riverBlue"
              as={Link}
              href={`/circles/${circle?.id}/edit`}
            >
              サークル編集
            </Button>
          )}
          {isMember ? (
            <Menu>
              <MenuButton
                position="fixed"
                bottom={{ base: 10, sm: 20 }}
                right={{ base: 10, sm: 5 }}
                zIndex={10}
                as={Button}
                startIcon={<PlusIcon fontSize="2xl" />}
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
          )}
        </>
      )
    }
    default: {
      return (
        <>
          <CircleMembershipButton
            circleId={circle?.id || ""}
            userId={userId}
            isAdmin={!!isAdmin}
            isMember={!!isMember}
          />
        </>
      )
    }
  }
}
