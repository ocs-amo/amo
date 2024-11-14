import { Center, Text } from "@yamada-ui/react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not Found - CIRCLIA",
  description: "Not Found - CIRCLIA",
}

const NotFound = () => {
  return (
    <Center w="full" h="full">
      <Text>ページが見つかりません</Text>
    </Center>
  )
}

export default NotFound
