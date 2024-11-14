import { demo } from "@/components/tab/tab-title"
import { Center, Text } from "@yamada-ui/react"

export const generateMetadata = () => demo("", "Not Found")

const NotFound = () => {
  return (
    <Center w="full" h="full">
      <Text>ページが見つかりません</Text>
    </Center>
  )
}

export default NotFound
