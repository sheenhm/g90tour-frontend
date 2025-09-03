import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"
import PageLayout from "@/components/layout/PageLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "지구공투어",
    description: "여행의 모든 것, 지구공투어",
    icons: "/favicon.png"
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
                <PageLayout>{children}</PageLayout>
                <Toaster />
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}