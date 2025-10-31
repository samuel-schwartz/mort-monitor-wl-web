import NextAuth from "next-auth"

export const { handlers,  signOut,  } = NextAuth({
  providers: [],
  secret: process.env.AUTH_SECRET || "dev-secret-key-for-local-development-min-32-chars-long",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session }) {
      return session
    },
  },
  trustHost: true,
})
