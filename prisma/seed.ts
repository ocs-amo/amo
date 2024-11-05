import { circle } from "./seeds/circle"
import { circleEventParticipants } from "./seeds/circle-event-participants"
import { circleEvents } from "./seeds/circle-events"
import { circleInstructors } from "./seeds/circle-instructors"
import { circleMemberRole } from "./seeds/circle-member-role"
import { circleMembers } from "./seeds/circle-members"
import { circleTags } from "./seeds/circle-tags"
import { user } from "./seeds/user"
import { db } from "@/utils/db"

async function main() {
  const result = await db.$transaction([
    user(), // PrismaPromiseをトランザクションに渡す
    circle(),
    circleMemberRole(),
    circleMembers(),
    circleInstructors(),
    circleTags(),
    circleEvents(),
    circleEventParticipants(),
  ])

  console.log("Transaction result:", result) // 結果を確認
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
