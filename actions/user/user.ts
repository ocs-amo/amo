"use server"
import { db } from "@/utils/db"

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileText: true,
        studentNumber: true,
        updatedAt: true,
        createdAt: true,
        image: true,
        accounts: true,
      },
    })
    return user
  } catch (error) {
    console.error("getUserById: ", error)
    return null
  }
}
