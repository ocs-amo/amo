import { Carousel, CarouselSlide } from "@yamada-ui/carousel"
import { ArrowLeftIcon, ArrowRightIcon, EllipsisIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
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
  userId: string
  currentAlbum: NonNullable<Awaited<ReturnType<typeof getAlbumById>>>
  isAdmin: boolean
  circleId: string
  handleDelete: (albumId: string) => Promise<void>
}

export const AlbumCard: FC<AlbumCard> = ({
  userId,
  currentAlbum,
  isAdmin,
  circleId,
  handleDelete,
}) => {
  return (
    <HStack flexDir={{ base: "row", md: "column" }} alignItems="start">
      <Carousel
        h={{ base: "full", md: "xs" }}
        controlPrevProps={{
        icon: <ArrowLeftIcon />, // 左矢印アイコンを指定
        bg: "blackAlpha.400", // 背景を黒の半透明に
        _hover: { bg: "blackAlpha.600" }, // ホバー時に濃い黒に
      }}
        controlNextProps={{
        icon: <ArrowRightIcon />, // 右矢印アイコンを指定
        bg: "blackAlpha.400", // 背景を黒の半透明に
        _hover: { bg: "blackAlpha.600" }, // ホバー時に濃い黒に
      }}
      >
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
            {isAdmin || currentAlbum.createdBy === userId ? (
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
        <Text as="pre" textWrap="wrap">
          {currentAlbum.description}
        </Text>
      </VStack>
    </HStack>
  )
}
