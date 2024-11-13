import { db } from "@/utils/db"

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    })
    return user
  } catch (error) {
    console.error("getUserByEmail: ", error)
    return null
  }
}

export const createUser = async (
  name: string,
  email: string,
  password: string,
  studentNumber: string,
) => {
  try {
    await db.user.create({
      data: {
        name,
        email,
        password,
        studentNumber,
      },
    })
  } catch (error) {
    console.error("createUser: ", error)
  }
}
