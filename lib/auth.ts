import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";
import { compare } from "bcrypt";
import { redirect } from "next/navigation";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "christiancaneos@gmail.com"
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        };

        const existingUser = await prisma.user.findUnique({
          where: {
            email: credentials?.email
          },
        });

        if (!existingUser) {
          return null;
        };

        //? for banned user
        // if (existingUser.status === "banned") {
        //   throw new Error("Your account has been banned.");
        // }

        const passwordMatched = await compare(credentials.password, existingUser.password);

        if (!passwordMatched) {
          throw new Error("Invalid email or password. Please try again.");
        };

        //? for unhashed password
        // if (credentials.password !== existingUser.password) {
        //   return null;
        // };

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
        }
        
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
        }
      }
    },
  }
}