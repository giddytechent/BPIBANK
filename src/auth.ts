import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

const ACCESS_TOKEN_LIFETIME_SECONDS = 30 * 60;
const REFRESH_TOKEN_LIFETIME_SECONDS = 2 * 24 * 60 * 60;
const SESSION_LIFETIME_SECONDS = 12 * 60 * 60;

function parseRememberMe(value: unknown): boolean {
  return value === true || value === "true" || value === "on";
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" },
      },

      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          role: user.role,
          email: user.email,
          name: user.name,
          remember: parseRememberMe(credentials.remember),
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: REFRESH_TOKEN_LIFETIME_SECONDS,
    updateAge: 0,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const remember = parseRememberMe(user.remember);
        const refreshLifetimeSeconds = remember
          ? REFRESH_TOKEN_LIFETIME_SECONDS
          : SESSION_LIFETIME_SECONDS;

        token.id = user.id;
        token.role = user.role;
        token.accessToken = randomUUID();
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_SECONDS * 1000;
        token.refreshToken = randomUUID();
        token.refreshTokenExpires = Date.now() + refreshLifetimeSeconds * 1000;
      } else if (
        token.refreshTokenExpires &&
        Date.now() >= token.refreshTokenExpires
      ) {
        token.error = "RefreshTokenExpired";
      } else if (
        token.accessTokenExpires &&
        Date.now() >= token.accessTokenExpires
      ) {
        token.accessToken = randomUUID();
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_SECONDS * 1000;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      }

      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}

export { NextAuth };
