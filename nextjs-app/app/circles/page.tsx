'use client';
import { CircleCard } from '@/components/data-display/circle-card';
import { SearchIcon, TriangleIcon } from '@yamada-ui/lucide';
import { Box, Button, Grid, Heading, HStack, IconButton, Input, InputGroup, InputLeftElement, VStack } from '@yamada-ui/react';
import { useRef } from 'react';

const circleMockData = [
  { id: 1, thumbnail: '', name: 'プログラミングサークル', people: 10, activityDay: '木・金' },
  { id: 2, thumbnail: '', name: 'ゲームサークル', people: 10, activityDay: '木・金' },
  { id: 3, thumbnail: '', name: '読書サークル', people: 10, activityDay: '木・金' },
  { id: 4, thumbnail: '', name: '料理サークル', people: 10, activityDay: '木・金' },
  { id: 5, thumbnail: '', name: 'スポーツサークル', people: 10, activityDay: '木・金' },
  { id: 6, thumbnail: '', name: 'サイクリングサークル', people: 10, activityDay: '木・金' },
  { id: 7, thumbnail: '', name: '旅行サークル', people: 10, activityDay: '木・金' },
  { id: 8, thumbnail: '', name: '旅行サークル', people: 10, activityDay: '木・金' },
  { id: 9, thumbnail: '', name: '旅行サークル', people: 10, activityDay: '木・金' },
  { id: 10, thumbnail: '', name: '旅行サークル', people: 10, activityDay: '木・金' },
  { id: 11, thumbnail: '', name: '旅行サークル', people: 10, activityDay: '木・金' },
  { id: 12, thumbnail: '', name: '旅行サークル', people: 10, activityDay: '木・金' },
  { id: 13, thumbnail: '', name: '旅行サークル', people: 10, activityDay: '木・金' },
];

const CirclesPage = () => {

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <VStack ref={scrollRef} w="full" h="fit-content" px="md" gap={0}>
        <VStack position="sticky" py="md" top={0} backgroundColor="Menu" as="header">
          <HStack alignItems={{ base: 'center', sm: 'start' }} flexDir={{ sm: 'column' }}>
            <Heading flex={1} as="h1" size="lg" >サークル一覧</Heading>
            <InputGroup flex={1}>
              <InputLeftElement>
                <SearchIcon color="gray.500" />
              </InputLeftElement>
              <Input type="search" placeholder="サークルを検索" pl="lg" />
            </InputGroup>
          </HStack>
          <Box textAlign="right"><Button>サークル作成</Button></Box>
        </VStack>
        <Grid pb="md" gridTemplateColumns={{ base: 'repeat(4, 1fr)', lg: 'repeat(3, 1fr)', md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }} gap="md" w="full">
          {
            circleMockData.map(data => <CircleCard key={data.id} data={data} />)
          }
        </Grid>
      </VStack>
      <IconButton position="fixed" colorScheme='primary' bottom="8" right="8" icon={<TriangleIcon />} onClick={handleScroll} />
    </>
  );
};

export default CirclesPage;