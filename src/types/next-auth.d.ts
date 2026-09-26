import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN"
    } & DefaultSession["user"]
    accessToken?: string
    error?: "RefreshTokenExpired"
  }
  interface User {
    id: string
    remember?: boolean
    role?: "USER" | "ADMIN"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: "USER" | "ADMIN"
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    refreshTokenExpires?: number
    error?: "RefreshTokenExpired"
  }
}
export {}
