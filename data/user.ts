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
        iconImagePath: true,
        accounts: true,
      },
    })
    return user
  } catch (error) {
    console.error("getUserById: ", error)
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
