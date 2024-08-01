import { randomInteger } from '@/utils/random';
import { Box, Card, CardBody, CardHeader, Divider, Flex, Grid, GridItem, Heading, HStack, Image, InfoIcon, ScrollArea, Tag, Text, VStack } from '@yamada-ui/react';

const notificationMockData = [
  { id: 1, icon: 'https://i.pravatar.cc/100', title: '今月からの新メンバー', createdAt: '2024-06-02 9:00', type: 'alert' },
  { id: 2, icon: 'https://picsum.photos/seed/picsum/100/100', title: 'やってみたいこと募集', createdAt: '2024-06-02 9:00', type: '' },
];

const circleMockData = [
  { id: 1, thumbnail: '', name: 'プログラミングサークル', people: 10, activityDay: '木・金' },
  { id: 2, thumbnail: '', name: 'ゲームサークル', people: 10, activityDay: '木・金' },
  { id: 3, thumbnail: '', name: 'イラストサークル', people: 10, activityDay: '木・金' }
];

const calendarMockData = [
  { date: '2', events: [] },
  { date: '3', events: [{ title: 'ゲームサークル' }] },
  { date: '4', events: [] },
  { date: '5', events: [] },
  { date: '6', events: [{ title: 'プログラミングサークル' }] },
  { date: '7', events: [] },
  { date: '8', events: [] },
];

export default function Home() {
  return (
    <VStack w="full" h="fit-content" p="md">
      <VStack>
        <Heading as="h2" size="lg">ようこそ！</Heading>
        <Divider w="full" borderWidth="2px" orientation="horizontal" variant="solid" />
        <Heading as="h2" size="lg">R4SA00{'　'}加古 林檎</Heading>
      </VStack>
      <Grid w="full" flexGrow={1} templateAreas={{
        base: `
        "notification circles circles circles" 
        "notification circles circles circles" 
        "notification calendar calendar calendar" 
        "notification calendar calendar calendar" 
        `,
        md: `
        "notification"
        "circles"
        "calendar"
        `
      }} gap="lg">
        <GridItem as={Card} area="notification" minW={{ base: 'md', sm: 'full' }}>
          <CardHeader><Heading as="h3" size="sm">お知らせ</Heading></CardHeader>
          <CardBody>
            <VStack overflowY="auto" gap="md">
              {notificationMockData.map((data) => (
                <HStack key={data.id} p="sm" borderWidth={1}>
                  <Box>
                    <Image src={data.icon} w="full" alt='icon image' />
                  </Box>
                  <VStack>
                    <HStack gap="sm">
                      {data.type === 'alert' ? <InfoIcon size="lg" color="primary" /> : undefined}
                      <Heading size="xs" as="h4">
                        {data.title}
                      </Heading>
                    </HStack>
                    <Flex justifyContent="right">
                      {data.createdAt}
                    </Flex>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </GridItem>
        <GridItem as={Card} area="circles">
          <CardHeader><Heading as="h3" size="sm">所属サークル</Heading></CardHeader>
          <CardBody>
            <Grid gridTemplateColumns={{ base: 'repeat(3, 1fr)', xl: 'repeat(2, 1fr)', lg: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }} gap="md" w="full">
              {
                circleMockData.map(data => (
                  <VStack key={data.id} gap={0} borderWidth={1} w="full" as={GridItem}>
                    <Image w="full" h="auto" src={`https://picsum.photos/seed/${randomInteger(100)}/200/100`} alt='preview image' />
                    <Box p="sm">
                      <Heading as="h4" size="xs">{data.name}</Heading>
                      <Text>人数：{data.people}</Text>
                      <Text>活動日：{data.activityDay}</Text>
                    </Box>
                  </VStack>
                ))
              }
            </Grid>
          </CardBody>
        </GridItem>
        <GridItem as={Card} area="calendar" w="full" overflowX="auto">
          <CardHeader><Heading as="h3" size="sm">カレンダー</Heading></CardHeader>
          <CardBody>
            <ScrollArea w="full" borderWidth={1}>
              <HStack w="full" gap={0}>
                {
                  calendarMockData.map((data, index) => (
                    <VStack key={index} h="full" flex={1} borderRightWidth={index >= 0 ? '1' : '0'} p="md" minW="2xs">
                      <Box>
                        {data.date}
                      </Box>
                      <VStack h="sm" overflowY="auto">
                        {
                          data.events.map((event, i) => (
                            <Tag key={i}>{event.title}</Tag>
                          ))
                        }
                      </VStack>
                    </VStack>
                  ))
                }
              </HStack>
            </ScrollArea>
          </CardBody>
        </GridItem>
      </Grid>
    </VStack>
  );
}