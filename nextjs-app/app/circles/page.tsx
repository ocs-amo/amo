import { CircleCard } from '@/components/data-display/circle-card';
import { SearchIcon } from '@yamada-ui/lucide';
import { Button, Grid, Heading, HStack, Input, InputGroup, InputLeftElement, VStack } from '@yamada-ui/react';

const circleMockData = [
  { id: 1, thumbnail: '', name: 'プログラミングサークル', people: 10, activityDay: '木・金' },
  { id: 2, thumbnail: '', name: 'ゲームサークル', people: 10, activityDay: '木・金' },
  { id: 3, thumbnail: '', name: '読書サークル', people: 10, activityDay: '木・金' },
  { id: 4, thumbnail: '', name: '料理サークル', people: 10, activityDay: '木・金' },
  { id: 5, thumbnail: '', name: 'スポーツサークル', people: 10, activityDay: '木・金' },
  { id: 6, thumbnail: '', name: 'サイクリングサークル', people: 10, activityDay: '木・金' },
  { id: 7, thumbnail: '', name: '旅行サークル', people: 10, activityDay: '木・金' },
];

const CirclesPage = () => {
  return (
    <>
      <VStack w="full" h="full" p="md">
        <HStack as="header" alignItems={{ base: 'center', sm: 'start' }} flexDir={{ sm: 'column' }}>
          <Heading flex={1} as="h1" size="lg" >サークル一覧</Heading>
          <InputGroup flex={1}>
            <InputLeftElement>
              <SearchIcon color="gray.500" />
            </InputLeftElement>
            <Input type="search" placeholder="サークルを検索" pl="lg" />
          </InputGroup>
        </HStack>
        <Grid gridTemplateColumns={{ base: 'repeat(4, 1fr)', lg: 'repeat(3, 1fr)', md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }} gap="md" w="full">
          {
            circleMockData.map(data => <CircleCard key={data.id} data={data} />)
          }
        </Grid>
      </VStack>
      <Button position="fixed" bottom="8" right="8">サークル作成</Button>
    </>
  );
};

export default CirclesPage;