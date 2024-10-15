"use client"
import {
  Box,
  forwardRef,
  GridItem,
  Heading,
  Image,
  Text,
  VStack,
} from "@yamada-ui/react"
import { memo } from "react"
import { randomInteger } from "@/utils/random"

export interface CircleCardProps {
  data: {
    id: string
    name: string
    description: string
    location: string
    imagePath: string | null
    activityDay: string | null
    memberCount: number
  }
}

export const CircleCard = memo(
  forwardRef<CircleCardProps, "div">(({ data }, ref) => {
    return (
      <VStack ref={ref} gap={0} borderWidth={1} w="full" as={GridItem}>
        <Image
          w="full"
          h="auto"
          src={`https://picsum.photos/seed/${randomInteger(100)}/200/100`}
          alt="preview image"
        />
        <Box p="sm">
          <Heading as="h4" size="xs">
            {data.name}
          </Heading>
          <Text>人数：{data.memberCount}</Text>
          <Text>活動日：{data.activityDay}</Text>
        </Box>
      </VStack>
    )
  }),
)

CircleCard.displayName = "CircleCard"
