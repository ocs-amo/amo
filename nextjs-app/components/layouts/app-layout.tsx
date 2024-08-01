'use client';
import { Box, HStack, IconButton, VStack } from '@yamada-ui/react';
import { BellIcon, CalendarDaysIcon, FileDigitIcon, HomeIcon, MessageCircleMoreIcon, SettingsIcon, UsersIcon } from '@yamada-ui/lucide';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export const AppLayout: FC<{ children?: ReactNode }> = ({ children }) => {

  const pathname = usePathname();

  return pathname !== '/login' ? <HStack w='100vw' h='100dvh' gap={0}>
    <VStack
      w="fit-content"
      h="full"
      p="sm"
      borderRight="1px solid"
      borderRightColor={['blackAlpha.500', 'whiteAlpha.500']}
      justifyContent='space-between'
    >
      <VStack>
        <IconButton
          w="50px"
          h="50px"
          justifyContent='center'
          alignItems="center"
          as={Link}
          variant='ghost'
          href='/'
          icon={<HomeIcon size="2xl" />}
          title="ホーム"
        />
        <IconButton
          w="50px"
          h="50px"
          justifyContent='center'
          alignItems="center"
          as={Link}
          variant='ghost'
          href='/'
          icon={<UsersIcon size="2xl" />}
          title="サークル一覧"
        />
        <IconButton
          w="50px"
          h="50px"
          justifyContent='center'
          alignItems="center"
          as={Link}
          variant='ghost'
          href='/'
          icon={<MessageCircleMoreIcon size="2xl" />}
          title="DM"
        />
        <IconButton
          w="50px"
          h="50px"
          justifyContent='center'
          alignItems="center"
          as={Link}
          variant='ghost'
          href='/'
          icon={<CalendarDaysIcon size="2xl" />}
          title="カレンダー"
        />
        <IconButton
          w="50px"
          h="50px"
          justifyContent='center'
          alignItems="center"
          as={Link}
          variant='ghost'
          href=''
          icon={<FileDigitIcon size="2xl" />}
          title="今日のイベント"
        />
        <IconButton
          w="50px"
          h="50px"
          justifyContent='center'
          alignItems="center"
          as={Link}
          variant='ghost'
          href='/notifications'
          icon={<BellIcon size="2xl" />}
          title="通知"
        />
      </VStack>
      <IconButton
        w="50px"
        h="50px"
        justifyContent='center'
        alignItems="center"
        as={Link}
        variant='ghost'
        href='/'
        icon={<SettingsIcon size="2xl" />}
        title="設定"
      />
    </VStack>
    <Box w='full' h='full' overflowY='auto'>
      {children}
    </Box>
  </HStack> : children;
};