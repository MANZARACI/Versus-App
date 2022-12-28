import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

export const authOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        client.close();

        if (!isValid) {
          throw new Error("Could not log you in!");
        }

        return { username: user.username, email: user.email, id: user._id };
      },
    }),
  ],
};

export default NextAuth(authOptions);
