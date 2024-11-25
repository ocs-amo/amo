//calendar/page.tsxからuse clientの分離

"use client"

import { Calendar } from "@yamada-ui/calendar"
import {
  VStack,
  Container,
  Center,
  Heading,
  List,
  ListItem,
  HStack,
  Button,
  Text,
} from "@yamada-ui/react"
import { useState } from "react"

type Event = {
  year: number
  month: number
  day: number
  name: string
  location: string
  time: string
}

export const CalendarPage = () => {
  const [activeTab, setActiveTab] = useState("allCircles")

  const events: Event[] = [
    {
      year: 2024,
      month: 5,
      day: 7,
      name: "プログラミングサークル",
      location: "402教室",
      time: "16:00〜18:00",
    },
    {
      year: 2024,
      month: 5,
      day: 7,
      name: "料理サークル",
      location: "701教室",
      time: "16:00〜18:00",
    },
    {
      year: 2024,
      month: 5,
      day: 7,
      name: "読書サークル",
      location: "会議室",
      time: "16:00〜18:00",
    },
    {
      year: 2024,
      month: 11,
      day: 7,
      name: "読書サークル",
      location: "会議室",
      time: "16:00〜18:00",
    },
    {
      year: 2024,
      month: 11,
      day: 7,
      name: "プログラミングサークル",
      location: "会議室",
      time: "16:00〜18:00",
    },
    {
      year: 2024,
      month: 11,
      day: 7,
      name: "aaaaaaaaaaaaaaaサークル",
      location: "会議室",
      time: "16:00〜18:00",
    },
    {
      year: 2024,
      month: 11,
      day: 14,
      name: "プログラミングサークル",
      location: "会議室",
      time: "16:00〜18:00",
    },
  ]

  return (
    <Container maxW="container.md" p={4}>
      <Heading mb={4}>カレンダー</Heading>
      <HStack justifyContent="flex-end" mb={4}>
        <Button
          variant="ghost"
          fontWeight={activeTab === "scheduled" ? "bold" : "normal"}
          onClick={() => setActiveTab("scheduled")}
          color={activeTab === "scheduled" ? "blue.500" : "gray.500"}
        >
          参加予定
        </Button>
        <Button
          variant="ghost"
          fontWeight={activeTab === "allCircles" ? "bold" : "normal"}
          onClick={() => setActiveTab("allCircles")}
          color={activeTab === "allCircles" ? "blue.500" : "gray.500"}
        >
          すべてのサークル
        </Button>
      </HStack>

      <Calendar
        dateFormat="YYYY年 M月"
        locale="ja"
        size="full"
        type="date"
        headerProps={{ mb: 2 }}
        labelProps={{ pointerEvents: "none", icon: { display: "none" } }}
        tableProps={{
          tableLayout: "fixed",
          width: "100%",
          border: "1px solid",
          borderColor: "border",
          th: { border: "1px solid", borderColor: "border" },
          td: {
            border: "1px solid",
            borderColor: "border",
            height: "135px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textAlign: "center",
            verticalAlign: "top",
          },
        }}
        dayProps={{
          h: "full",
          rounded: "none",
          p: 0,
          _active: {},
          component: ({ date, isSelected }) => {
            const dayEvents = events.filter(
              (event) =>
                event.year === date.getFullYear() &&
                event.month === date.getMonth() + 1 &&
                event.day === date.getDate(),
            )

            // 表示するイベントのリストと、省略されるイベント数
            const displayedEvents = dayEvents.slice(0, 2)
            const hiddenEventCount = dayEvents.length - displayedEvents.length

            return (
              <VStack alignItems="center" w="100%" h="100%" overflow="hidden">
                <Center w="100%" py={1}>
                  {date.getDate()}
                </Center>

                <List w="full" px={2} overflow="hidden">
                  {displayedEvents.map((event, index) => (
                    <ListItem
                      key={index}
                      width="95%"
                      minWidth="80px"
                      py="0.1"
                      px="2"
                      bg="gray.200"
                      color="black"
                      fontSize="xs"
                      lineHeight="taller"
                      rounded="md"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      textAlign="center"
                      mx="auto"
                    >
                      {event.name}
                    </ListItem>
                  ))}
                  {hiddenEventCount > 0 && (
                    <Text
                      fontSize="xs"
                      color={isSelected ? "white" : "gray.500"}
                      textAlign="right"
                      mt={1}
                    >
                      ...他{hiddenEventCount}件
                    </Text>
                  )}
                </List>
              </VStack>
            )
          },
        }}
      />
    </Container>
  )
}
