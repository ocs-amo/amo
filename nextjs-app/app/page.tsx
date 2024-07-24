import { Box, Card, CardBody, CardHeader, Divider, Flex, Grid, GridItem, Heading, HStack, Image, InfoIcon, VStack } from "@yamada-ui/react";

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
        <GridItem as={Card} area="notification">
          <CardHeader><Heading as="h3" size="sm">お知らせ</Heading></CardHeader>
          <CardBody>
            <VStack overflowY="auto" gap="md">
              {notificationMockData.map((data) => (
                <HStack key={data.id} p="sm" borderWidth={1}>
                  <Box>
                    <Image src="https://i.pravatar.cc/100" w="full" />
                  </Box>
                  <VStack>
                    <HStack gap="sm">
                      {data.type === "alert" ? <InfoIcon size="lg" color="primary" /> : undefined}
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
