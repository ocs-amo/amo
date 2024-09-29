"use client"
import {
  BellIcon,
  CalendarDaysIcon,
  FileDigitIcon,
  HouseIcon,
  MessageCircleMoreIcon,
  SettingsIcon,
  UsersIcon,
} from "@yamada-ui/lucide"
import { Box, HStack, IconButton, VStack } from "@yamada-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { FC, ReactNode } from "react"

export const AppLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  const pathname = usePathname()

  return pathname !== "/login" ? (
    <HStack w="100vw" h="100dvh" gap={0}>
      <VStack
        w="fit-content"
        h="full"
        p="sm"
        borderRightWidth={1}
        justifyContent="space-between"
      >
        <VStack>
          <IconButton
            w="50px"
            h="50px"
            justifyContent="center"
            alignItems="center"
            as={Link}
            variant="ghost"
            href="/"
            icon={<HouseIcon fontSize="2xl" />}
            title="ホーム"
          />
          <IconButton
            w="50px"
            h="50px"
            justifyContent="center"
            alignItems="center"
            as={Link}
            variant="ghost"
            href="/circles"
            icon={<UsersIcon fontSize="2xl" />}
            title="サークル一覧"
          />
          <IconButton
            w="50px"
            h="50px"
            justifyContent="center"
            alignItems="center"
            as={Link}
            variant="ghost"
            href="/"
            icon={<MessageCircleMoreIcon fontSize="2xl" />}
            title="DM"
          />
          <IconButton
            w="50px"
            h="50px"
            justifyContent="center"
            alignItems="center"
            as={Link}
            variant="ghost"
            href="/"
            icon={<CalendarDaysIcon fontSize="2xl" />}
            title="カレンダー"
          />
          <IconButton
            w="50px"
            h="50px"
            justifyContent="center"
            alignItems="center"
            as={Link}
            variant="ghost"
            href=""
            icon={<FileDigitIcon fontSize="2xl" />}
            title="今日のイベント"
          />
          <IconButton
            w="50px"
            h="50px"
            justifyContent="center"
            alignItems="center"
            as={Link}
            variant="ghost"
            href="/notifications"
            icon={<BellIcon fontSize="2xl" />}
            title="通知"
          />
        </VStack>
        <IconButton
          w="50px"
          h="50px"
          justifyContent="center"
          alignItems="center"
          as={Link}
          variant="ghost"
          href="/"
          icon={<SettingsIcon fontSize="2xl" />}
          title="設定"
        />
      </VStack>
      <Box w="full" h="full" overflowY="auto">
        {children}
      </Box>
    </HStack>
  ) : (
    children
  )
}
