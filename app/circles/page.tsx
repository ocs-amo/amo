"use client"
import { SearchIcon, TriangleIcon } from "@yamada-ui/lucide"
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useAsync,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { getCircles } from "@/actions/circle/fetch-circle"
import { CircleCard } from "@/components/data-display/circle-card"

const CirclesPage = () => {
  useEffect(() => {
    document.title = "サークル一覧 - CIRCLIA"
  }, [])
  const { value } = useAsync(async () => {
    return await getCircles()
  }, [])

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = () => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <>
      <VStack ref={scrollRef} w="full" h="fit-content" px="md" gap={0}>
        <VStack
          position="sticky"
          py="md"
          top={0}
          backgroundColor="Menu"
          as="header"
          zIndex={1}
        >
          <HStack
            alignItems={{ base: "center", sm: "start" }}
            flexDir={{ sm: "column" }}
          >
            <Heading flex={1} as="h1" size="lg">
              サークル一覧
            </Heading>
            <InputGroup flex={1}>
              <InputLeftElement>
                <SearchIcon color="gray.500" />
              </InputLeftElement>
              <Input type="search" placeholder="サークルを検索" pl="lg" />
            </InputGroup>
          </HStack>
          <Box textAlign="right">
            <Button as={Link} href="/circles/create">
              サークル作成
            </Button>
          </Box>
        </VStack>
        <Grid
          pb="md"
          gridTemplateColumns={{
            base: "repeat(4, 1fr)",
            lg: "repeat(3, 1fr)",
            md: "repeat(2, 1fr)",
            sm: "repeat(1, 1fr)",
          }}
          gap="md"
          w="full"
        >
          {value?.map((data) => <CircleCard key={data.id} data={data} />)}
        </Grid>
      </VStack>
      <IconButton
        position="fixed"
        colorScheme="primary"
        bottom="8"
        right="8"
        icon={<TriangleIcon />}
        onClick={handleScroll}
      />
    </>
  )
}

export default CirclesPage
