"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi, type User, type LoginRequest, type SignupRequest } from "@/lib/api"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (data: LoginRequest) => Promise<void>
    signup: (data: SignupRequest) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("accessToken")
            if (token) {
                try {
                    // 토큰이 유효한지 확인하고 사용자 정보를 가져옵니다.
                    const userInfo = await authApi.getUserInfo()
                    setUser(userInfo)
                } catch (error) {
                    console.error("Failed to fetch user info with token:", error)
                    // 토큰이 유효하지 않으면 로그아웃 처리
                    authApi.logout()
                }
            }
            setIsLoading(false)
        }
        initializeAuth()
    }, [])

    const login = async (data: LoginRequest) => {
        try {
            await authApi.login(data)
            const userInfo = await authApi.getUserInfo()
            setUser(userInfo)
            localStorage.setItem("user", JSON.stringify(userInfo))
        } catch (error: any) {
            throw error
        }
    }

    const signup = async (data: SignupRequest) => {
        try {
            await authApi.signup(data)
            await login({ email: data.email, password: data.password })
        } catch (error: any) {
            throw error
        }
    }

    const logout = () => {
        authApi.logout()
        setUser(null)
        router.push("/")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}