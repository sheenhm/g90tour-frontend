"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi, User as ApiUser } from "@/lib/api"
import AdminHeader from "@/components/layout/admin-header"
import AdminFooter from "@/components/layout/admin-footer"
import AdminSidebar from "@/components/layout/admin-sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [isVerified, setIsVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<ApiUser | null>(null)

    useEffect(() => {
        const verifyAdminAccess = async () => {
            try {
                const userInfo = await authApi.getUserInfo()

                if (userInfo.role === "ADMIN") {
                    setUser(userInfo)
                    setIsVerified(true)
                } else {
                    alert("접근 권한이 없습니다.")
                    router.push("/")
                }
            } catch (error) {
                alert("로그인이 필요하거나 세션이 만료되었습니다.")
                router.push("/login")
            } finally {
                setIsLoading(false)
            }
        }

        verifyAdminAccess()
    }, [router])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        )
    }

    if (isVerified && user) {
        return (
            <div className="flex min-h-screen">
                <AdminSidebar />
                <div className="flex flex-1 flex-col">
                    <AdminHeader user={user} />
                    <main className="flex-1 p-6">{children}</main>
                    <AdminFooter />
                </div>
            </div>
        )
    }

    return null
}
