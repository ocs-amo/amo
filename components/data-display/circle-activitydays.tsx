"use client"
import { MonthPicker } from "@yamada-ui/calendar"
import { PlusIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import { HStack, IconButton, VStack } from "@yamada-ui/react"
import "dayjs/locale/ja"

export const CircleActivitydays: FC = () => {
  return (
    <VStack>
      <HStack justifyContent="space-between">
        <MonthPicker w="md" locale="ja" />
        <IconButton icon={<PlusIcon />} />
      </HStack>
      <VStack></VStack>
    </VStack>
  )
}
