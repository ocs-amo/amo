import { auth } from "../../auth"
import { NotificationPage } from "../../components/layouts/notification-page"
import { getAnnouncementsByUserId } from "../../data/announcement"

export const metadata = {
  title: "通知 - CIRCLIA",
}

const Page = async () => {
  const session = await auth()
  const announcements = await getAnnouncementsByUserId(session?.user?.id || "")

  return <NotificationPage announcements={announcements} />
}

export default Page
