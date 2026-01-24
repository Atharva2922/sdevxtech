import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),

        // Email/Password Provider
        CredentialsProvider({
            id: "credentials",
            name: "Email and Password",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please provide email and password");
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                if (user.authProvider !== 'local') {
                    throw new Error(`Please sign in with ${user.authProvider}`);
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            }
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    await connectDB();

                    // Check if user exists
                    let existingUser = await User.findOne({ email: user.email });

                    if (existingUser) {
                        // Update existing user with Google info if not already set
                        if (!existingUser.googleId) {
                            existingUser.googleId = account.providerAccountId;
                            existingUser.authProvider = 'google';
                            existingUser.emailVerified = true;
                            if (user.image) existingUser.image = user.image;
                            await existingUser.save();
                        }
                    } else {
                        // Create new user from Google data
                        existingUser = await User.create({
                            name: user.name || user.email?.split('@')[0],
                            email: user.email,
                            image: user.image,
                            role: "user",
                            authProvider: "google",
                            googleId: account.providerAccountId,
                            emailVerified: true,
                        });
                    }

                    return true;
                } catch (error) {
                    console.error("Error in Google sign in:", error);
                    return false;
                }
            }

            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            if (account?.provider === "google") {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
