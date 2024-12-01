"use server"
import { auth } from "auth"
import { updateUser } from "data/user"
import type { BackUserProfileForm } from "schema/user"
import { db } from "utils/db"

export const updateUserAction = async (data: BackUserProfileForm) => {
  const session = await auth()
  const user = await getUserById(session?.user?.id || "")
  if (!session || !user) {
    return {
      success: false,
      error: "ユーザーが存在しません",
    }
  }
  try {
    const result = await updateUser(
      user.id,
      data.profileText || "",
      data.image || "",
    )
    return {
      success: true,
      user: result,
    }
  } catch (error) {
    console.error("update user error:", error)
    return {
      success: false,
      error: "プロフィールの更新に失敗しました",
    }
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
