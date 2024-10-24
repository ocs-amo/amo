"use client"
import {
  Box,
  forwardRef,
  GridItem,
  Heading,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { memo } from "react"

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
        <LinkBox>
          {data.imagePath ? (
            <Image w="full" h="40" src={data.imagePath} alt="preview image" />
          ) : (
            <Box w="full" h="40" {...{ backgroundColor: "gray.100" }} />
          )}
          <Box p="sm">
            <Heading as="h4" size="xs">
              <LinkOverlay as={Link} href={`/circles/${data.id}`}>
                {data.name}
              </LinkOverlay>
            </Heading>
            <Text>人数：{data.memberCount}人</Text>
            <Text>活動日：{data.activityDay}</Text>
          </Box>
        </LinkBox>
      </VStack>
    )
  }),
)

CircleCard.displayName = "CircleCard"
