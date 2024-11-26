import { z } from "zod"
import { getBase64Image } from "@/utils/file"

export const UserIconSchema = z
  .custom<FileList>()
  .optional() // 画像ファイルはオプション
  .refine(
    (file) =>
      typeof file === "string" ||
      !file ||
      file.length === 0 ||
      (file.length > 0 && file[0].type.startsWith("image/")),
    {
      message: "画像ファイルを選択してください",
    },
  )
  .transform(async (file) => {
    if (typeof file === "string" || !file || file.length === 0) {
      return null // 画像がない場合はnullを返す
    }
    const selectedFile = file[0]
    return await getBase64Image(selectedFile)
  })

export const UserProfileSchema = z.object({
  profileText: z.string().optional(),
})

export const FrontUserProfileSchema = UserProfileSchema.extend({
  image: UserIconSchema,
}).brand<"FrontUserProfileSchema">()

export type FrontUserProfileForm = z.infer<typeof FrontUserProfileSchema>

export const BackUserProfileSchema = UserProfileSchema.extend({
  image: z.string().optional().nullable(),
}).brand<"BackUserProfileSchema">()

export type BackUserProfileForm = z.infer<typeof BackUserProfileSchema>
