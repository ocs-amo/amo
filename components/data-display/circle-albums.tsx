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
  LinkBox,
  LinkOverlay,
  Loading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Snacks,
  Text,
  useBoolean,
  useSafeLayoutEffect,
  useSnacks,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useState } from "react"
import { AlbumCard } from "./album-card"
import {
  handleDeleteAlbum,
  handleGetAlbumById,
  handleGetAlbumsByCircleId,
} from "@/actions/circle/album"
import type { getAlbumById } from "@/data/album"
import { parseDate } from "@/utils/format"

interface CircleAlbums {
  userId: string
  circleId: string
  isMember: boolean
  isAdmin: boolean
  currentAlbum?: Awaited<ReturnType<typeof getAlbumById>>
}

export const CircleAlbums: FC<CircleAlbums> = ({
  circleId,
  isAdmin,
  currentAlbum: album,
}) => {
  const [albums, setAlbum] = useState<
    Awaited<ReturnType<typeof handleGetAlbumsByCircleId>>
  >([])
  const [currentAlbum, setCurrentAlbum] = useState(album)

  const [loading, { off: loadingOff, on: loadingOn }] = useBoolean(true)
  const { snack, snacks } = useSnacks()

  const fetchData = async () => {
    loadingOn()
    const newAlbums = await handleGetAlbumsByCircleId(circleId)
    setAlbum(newAlbums)
    const newCurrentAlbum = await handleGetAlbumById(album?.id || "")
    setCurrentAlbum(newCurrentAlbum)
    loadingOff()
  }

  const handleDelete = async (albumId: string) => {
    const { success, error } = await handleDeleteAlbum(circleId, albumId)
    if (success) {
      snack({ title: "アルバムを削除しました", status: "success" })
      await fetchData()
    } else {
      snack({ title: error, status: "error" })
    }
  }

  useSafeLayoutEffect(() => {
    fetchData()
  }, [])
  return (
    <VStack>
      <Snacks snacks={snacks} />
      {currentAlbum ? (
        <AlbumCard
          circleId={circleId}
          isAdmin={isAdmin}
          currentAlbum={currentAlbum}
          handleDelete={handleDelete}
        />
      ) : loading ? (
        <Center w="full">
          <Loading fontSize="xl" />
        </Center>
      ) : albums.length === 0 ? (
        <Center w="full">
          <Text>アルバムがありません</Text>
        </Center>
      ) : (
        <Grid
          templateColumns={{
            base: "repeat(3, 1fr)",
            lg: "repeat(2, 1fr)",
            md: "repeat(1, 1fr)",
          }}
          gap="md"
        >
          {albums.map((album) => (
            <GridItem key={album.id} as={Card} flexDir="column" bg="white">
              <LinkBox>
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
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Heading
                      as={LinkOverlay}
                      href={`/circles/${circleId}/album/${album.id}`}
                    >
                      {album.title}
                    </Heading>
                    <HStack ml="auto">
                      <Text>{parseDate(album.createdAt)}</Text>
                      {isAdmin ? (
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<EllipsisIcon fontSize="2xl" />}
                            variant="outline"
                            isRounded
                          />
                          <MenuList>
                            <MenuItem
                              as={Link}
                              href={`/circles/${circleId}/album/${album.id}/edit`}
                            >
                              編集
                            </MenuItem>
                            <MenuItem
                              color="red"
                              onClick={() => handleDelete(album.id)}
                            >
                              削除
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      ) : undefined}
                    </HStack>
                  </HStack>
                  <Text as="pre" textWrap="wrap" lineClamp={3}>
                    {album.description}
                  </Text>
                </VStack>
              </LinkBox>
            </GridItem>
          ))}
        </Grid>
      )}
    </VStack>
  )
}
