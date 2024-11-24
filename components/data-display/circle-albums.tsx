"use client"
import { Carousel, CarouselSlide } from "@yamada-ui/carousel"
import { EllipsisIcon } from "@yamada-ui/lucide"
import type { FC } from "@yamada-ui/react"
import {
  Card,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Loading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBoolean,
  useSafeLayoutEffect,
  VStack,
} from "@yamada-ui/react"
import { useState } from "react"
import { handleGetAlbumsByCircleId } from "@/actions/circle/album"
import { parseDate } from "@/utils/format"

interface CircleAlbums {
  userId: string
  circleId: string
  isMember: boolean
  isAdmin: boolean
}

export const CircleAlbums: FC<CircleAlbums> = ({ circleId, isAdmin }) => {
  const [albums, setAlbum] = useState<
    Awaited<ReturnType<typeof handleGetAlbumsByCircleId>>
  >([])
  const [loading, { off: loadingOff, on: loadingOn }] = useBoolean(true)

  const fetchData = async () => {
    loadingOn()
    const newAlbums = await handleGetAlbumsByCircleId(circleId)
    setAlbum(newAlbums)
    loadingOff()
  }

  useSafeLayoutEffect(() => {
    fetchData()
  }, [])
  return loading ? (
    <Center w="full">
      <Loading fontSize="xl" />
    </Center>
  ) : albums.length === 0 ? (
    <Center w="full">
      <Text>アルバムがありません</Text>
    </Center>
  ) : (
    <Grid
      templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(1, 1fr)" }}
      gap="md"
    >
      {albums.map((album) => (
        <GridItem key={album.id} as={Card} flexDir="column" bg="white">
          <Carousel h="xs">
            {album.images.map((image) => (
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
          <VStack p="md">
            <HStack justifyContent="space-between" alignItems="center">
              <HStack>
                <Heading>{album.title}</Heading>
                <Text>{parseDate(album.createdAt)}</Text>
              </HStack>
              {isAdmin ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<EllipsisIcon fontSize="2xl" />}
                    variant="outline"
                    isRounded
                  />
                  <MenuList>
                    <MenuItem>編集</MenuItem>
                    <MenuItem color="red">削除</MenuItem>
                  </MenuList>
                </Menu>
              ) : undefined}
            </HStack>
            <Text as="pre">{album.description}</Text>
          </VStack>
        </GridItem>
      ))}
    </Grid>
  )
}
