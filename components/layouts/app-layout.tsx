"use client"
import {
  BellIcon,
  CalendarDaysIcon,
  FileDigitIcon,
  HouseIcon,
  LogOutIcon,
  MessageCircleMoreIcon,
  SettingsIcon,
  UsersIcon,
} from "@yamada-ui/lucide"
import {
  Box,
  Heading,
  HStack,
  IconButton,
  useSafeLayoutEffect,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import type { FC, ReactNode } from "react"
import { signout } from "@/actions/auth/signout"
import type { getUserById } from "@/actions/user/user"

export const AppLayout: FC<{
  children?: ReactNode
  user?: Awaited<ReturnType<typeof getUserById>>
}> = ({ children, user }) => {
  const pathname = usePathname()
  useSafeLayoutEffect(() => {
    if (!user && pathname !== "/signin") {
      signOut({ redirectTo: "/signin" })
    }
  }, [])
  return pathname !== "/signin" ? (
    <VStack w="100vw" h="100dvh" gap={0}>
      <VStack w="full" bgColor="black" px="md">
        <Heading
          position="relative"
          color="white"
          _firstLetter={{ color: "#35B0D2" }}
          fontWeight="light"
          textShadow="1px 1px 0 #666,2px 2px 0 #666,3px 3px 0 #666"
        >
          CIRCLIA
        </Heading>
      </VStack>
      <HStack w="full" h="full" gap={0}>
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
              href="/calendar"
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
              href="/notifications"
              icon={<BellIcon fontSize="2xl" />}
              title="通知"
            />
            <IconButton
              w="50px"
              h="50px"
              justifyContent="center"
              alignItems="center"
              variant="ghost"
              onClick={() => signout()}
              icon={<LogOutIcon fontSize="2xl" />}
              title="ログアウト"
            />
          </VStack>
        </VStack>
        <Box w="full" h="full" overflowY="auto">
          {children}
        </Box>
      </HStack>
    </VStack>
  ) : (
    children
  )
}
