"use client"
import type { FC } from "@yamada-ui/react"
import { Grid, GridItem, IconButton, Image } from "@yamada-ui/react"
import { XIcon } from "@yamada-ui/lucide"

export const AlbumPreviewGrid: FC<{
  images: string[]
  onRemove: (index: number) => void
}> = ({ images, onRemove }) => (
  <Grid
    templateColumns="repeat(5, 1fr)"
    templateRows="repeat(2, 1fr)"
    gap="md"
    overflow="auto"
    pt="sm"
  >
    {images.map((src, index) => (
      <GridItem key={index} boxSize="100px" position="relative" rounded="md">
        <Image
          src={src}
          alt={`preview-${index}`}
          boxSize="full"
          borderRadius="md"
          objectFit="cover"
        />
        <IconButton
          size="xs"
          fullRounded
          icon={<XIcon />}
          position="absolute"
          top="-sm"
          right="-sm"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
          colorScheme="danger"
          aria-label="画像削除"
        />
      </GridItem>
    ))}
  </Grid>
)
