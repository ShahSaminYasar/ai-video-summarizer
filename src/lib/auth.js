import connectDB from "@/lib/connectDB";
import { User } from "@/models/user.model";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "consent" } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();

        const dbUser = await User.findOneAndUpdate(
          { email: user.email },
          {
            name: user.name,
            avatar: user.image,
            email: user.email,
          },
          { upsert: true, new: true }
        );

        user.id = dbUser?._id?.toString();
        return true;
      } catch (error) {
        console.error("Error saving user to DB:", error);
        return false;
      }
    },

    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token?.id;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/signin" },
};
