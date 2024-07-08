import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

interface User {
  id: string;
  email: string;
  role: string; // Assuming role is a string, update accordingly if it's a different type
  // Add other properties if needed
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },  // Correct type for password
      },
      authorize: async (credentials, request) => {
        try {
          const email = credentials.email as string;
          const password = credentials.password as string;
      
          // Find the user in the database based on the provided email
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              role: true, 
            },
          });

          const role = user?.role ? user.role.name : "defaultRole";

      
          if (!user || !user.password) {
            throw new Error("Invalid email or password.");
          }
      
          // Verify the password
          const isValidPassword = password === user.password;
          if (!isValidPassword) {
            throw new Error("Invalid email or password.");
          }
      
          // Return the user object if authentication is successful
          return { id: user.id.toString(), email: user.email, role }; 
        } catch (error) {
          console.error("Error during authorization:", error);
          return null; 
        }
      },
      
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: '/register'
  },
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session instead of database sessions
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
});