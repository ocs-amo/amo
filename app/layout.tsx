import { UIProvider } from "@yamada-ui/react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { AppLayout } from "@/components/layouts/app-layout"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CIRCLIA",
  description: "CIRCLIA",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <UIProvider>
          <SessionProvider>
            <AppLayout>{children}</AppLayout>
          </SessionProvider>
        </UIProvider>
      </body>
    </html>
  )
}
