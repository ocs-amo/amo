import { db } from "@/utils/db"

export const updateUser = async (
  userId: string,
  profileText: string,
  image: string,
) =>
  db.user.update({
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      profileText: true,
      studentNumber: true,
    },
    where: {
      id: userId,
    },
    data: {
      profileText,
      image,
    },
  })

export const getUsers = async () =>
  db.user.findMany({
    select: {
      id: true,
      image: true,
      name: true,
      profileText: true,
      studentNumber: true,
      CircleMember: {
        include: {
          circle: true,
        },
      },
    },
  })

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
