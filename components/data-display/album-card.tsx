import { Carousel, CarouselSlide } from "@yamada-ui/carousel"
import { EllipsisIcon } from "@yamada-ui/lucide"
import type {
  FC} from "@yamada-ui/react";
import {
  Center,
  Heading,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import type { getAlbumById } from "@/data/album"
import { parseDate } from "@/utils/format"

interface AlbumCard {
  currentAlbum: NonNullable<Awaited<ReturnType<typeof getAlbumById>>>
  isAdmin: boolean
  circleId: string
  handleDelete: (albumId: string) => Promise<void>
}

export const AlbumCard: FC<AlbumCard> = ({
  currentAlbum,
  isAdmin,
  circleId,
  handleDelete,
}) => {
  return (
    <HStack flexDir={{ base: "row", md: "column" }} alignItems="start">
      <Carousel h={{ base: "full", md: "xs" }}>
        {currentAlbum.images.map((image) => (
          <CarouselSlide key={image.id} as={Center}>
            <Image
              boxSize="full"
              objectFit="cover"
              src={image.imageUrl}
              alt={image.albumId}
            />
          </CarouselSlide>
        ))}
      </Carousel>
      <VStack w="full" h="full">
        <HStack justifyContent="space-between" flexWrap="wrap">
          <Heading>{currentAlbum.title}</Heading>
          <HStack>
            <Text>{parseDate(currentAlbum.createdAt)}</Text>
            {isAdmin ? (
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
                    href={`/circles/${circleId}/album/${currentAlbum.id}/edit`}
                  >
                    編集
                  </MenuItem>
                  <MenuItem
                    color="red"
                    onClick={() => handleDelete(currentAlbum.id)}
                  >
                    削除
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : undefined}
          </HStack>
        </HStack>
        <Text as="pre">{currentAlbum.description}</Text>
      </VStack>
    </HStack>
  )
}
