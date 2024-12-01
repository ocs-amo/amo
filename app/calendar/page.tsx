import { auth } from "../../auth"
import { CalendarPage } from "../../components/layouts/calendar"
import { getMonthlyEvents } from "../../data/activity"

export const metadata = {
  title: "カレンダー - CIRCLIA",
}

const Calendar = async () => {
  const session = await auth()
  const events = await getMonthlyEvents(session?.user?.id || "", new Date())
  return <CalendarPage events={events} userId={session?.user?.id || ""} />
}

export default Calendar
