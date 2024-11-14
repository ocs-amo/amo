import { UIProvider } from "@yamada-ui/react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { getUserById } from "@/actions/user/user"
import { auth } from "@/auth"
import { AppLayout } from "@/components/layouts/app-layout"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CIRCLIA",
  description: "CIRCLIA",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const user = await getUserById(session?.user?.id || "")
  return (
    <html lang="ja">
      <body className={inter.className}>
        <UIProvider>
          <SessionProvider>
            <AppLayout user={user}>{children}</AppLayout>
          </SessionProvider>
        </UIProvider>
      </body>
    </html>
  )
}
