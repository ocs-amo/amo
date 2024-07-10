"use client"
import { Box, HStack, IconButton, VStack } from "@yamada-ui/react";
import { BellIcon, CalendarDaysIcon, FileDigitIcon, HomeIcon, MessageCircleMoreIcon, SettingsIcon, UsersIcon } from '@yamada-ui/lucide'
import Link from "next/link";
import { FC, ReactNode } from "react";
import { usePathname } from "next/navigation";

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
    const pathname = usePathname()

    console.log(pathname);
    
    
    return pathname !== '/login' ? <HStack w='100vw' h='100dvh' gap={0}>
        <VStack
            w="fit-content"
            h="full"
            p="sm"
            borderRight="1px solid"
            borderRightColor={["blackAlpha.500", "whiteAlpha.500"]}
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
                    icon={<HomeIcon />}
                />
                <IconButton
                    w="50px"
                    h="50px"
                    justifyContent='center'
                    alignItems="center"
                    as={Link}
                    variant='ghost'
                    href='/'
                    icon={<UsersIcon />}
                />
                <IconButton
                    w="50px"
                    h="50px"
                    justifyContent='center'
                    alignItems="center"
                    as={Link}
                    variant='ghost'
                    href='/'
                    icon={<MessageCircleMoreIcon />}
                />
                <IconButton
                    w="50px"
                    h="50px"
                    justifyContent='center'
                    alignItems="center"
                    as={Link}
                    variant='ghost'
                    href='/'
                    icon={<CalendarDaysIcon />}
                />
                <IconButton
                    w="50px"
                    h="50px"
                    justifyContent='center'
                    alignItems="center"
                    as={Link}
                    variant='ghost'
                    href=''
                    icon={<FileDigitIcon />}
                />
                <IconButton
                    w="50px"
                    h="50px"
                    justifyContent='center'
                    alignItems="center"
                    as={Link}
                    variant='ghost'
                    href=''
                    icon={<BellIcon />}
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
                icon={<SettingsIcon />}
            />
        </VStack>
        <Box w='full' h='full' overflowY='auto'>
            {children}
        </Box>
    </HStack> : children
}