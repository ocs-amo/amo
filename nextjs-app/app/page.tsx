import { Box, Card, CardBody, CardHeader, Divider, Grid, GridItem, Heading, VStack } from "@yamada-ui/react";

const notificationMockData = [
  { id: 1, icon: "", title: "今月からの新メンバー", createdAt: "2024-06-02 9:00", type: "alert"},
  { id: 2, icon: "", title: "やってみたいこと募集", createdAt: "2024-06-02 9:00", type: ""},
]

export default function Home() {
  return (
    <VStack w="full" h="full" p="md">
      <VStack>
        <Heading as="h2" size="lg">ようそこ！</Heading>
        <Divider w="full" borderWidth="2px" orientation="horizontal" variant="solid" />
        <Heading as="h2" size="lg">R4SA00　加古 林檎</Heading>
      </VStack>
      <Grid w="full" flexGrow={1} templateAreas={{
        base: `
        "notification circles"
        "notification circles"
        "notification calendar"
        "notification calendar"
        `,
        md: `
        "notification"
        "circles"
        "calendar"
        `
      }} gap="md">
        <GridItem as={Card} area="notification">
          <CardHeader><Heading as="h3" size="sm">通知</Heading></CardHeader>
          <CardBody>
            <VStack overflowY="auto" gap="md">
              {notificationMockData.map((data) => (
                <Box key={data.id}>
                  {data.title}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </GridItem>
        <GridItem as={Card} area="circles">
          <CardHeader><Heading as="h3" size="sm">サークル一覧</Heading></CardHeader>
          <CardBody></CardBody>
        </GridItem>
        <GridItem as={Card} area="calendar">
          <CardHeader><Heading as="h3" size="sm">カレンダー</Heading></CardHeader>
          <CardBody></CardBody>
        </GridItem>
      </Grid>
    </VStack>
  );
}
