import { getCircles } from "@/actions/circle/fetch-circle"
import { CirclesPage } from "@/components/layouts/circles-page"

export const metadata = {
  title: "サークル一覧 - CIRCLIA",
}

const Circles = async () => {
  const circles = await getCircles()
  return <CirclesPage circles={circles} />
}

export default Circles
