import { betterAuth, generateId } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { cache } from "react";
import { admin, ac, user } from "./access";
import prisma from "../db/prisma";

export const auth = betterAuth({
  baseURL: process.env.APP_URL,
  trustedOrigins: [
    process.env.APP_URL!,
    "https://to-do-r8q7f49c5-sanket-man-tapols-projects.vercel.app",
  ],
  secret: process.env.BETTER_AUTH_SECRET!,
  cookie: {
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    httpOnly: true,
  },
  plugins: [
    adminPlugin({
      defaultRole: "customer",
      adminRoles: ["admin"],
      ac,
      roles: {
        admin,
        user,
      },
    }),
    nextCookies(),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true, //set cookie immediately
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`Reset password url for ${user.email}: ${url}`);
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`Verification url for ${user.email}: ${url}`)
      }
    },
  },
});

export const isAuthenticated = async () => {
  try {
    return !!(await getSignedInUser());
  } catch {
    return false;
  }
};

export const getSignedInUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Not authenticated");

  return session.user;
});

export const getUserRole = async () => {
  const user = await getSignedInUser();

  return user.role;
};

const getDate = (span: number, unit: "sec" | "ms" = "ms") => {
  return new Date(Date.now() + (unit === "sec" ? span * 1000 : span));
};

export const createResetPasswordToken = async (userId: string) => {
  const ctx = await auth.$context;

  const expiresIn = 60 * 60 * 1;
  const expiresAt = getDate(
    ctx.options?.emailAndPassword?.resetPasswordTokenExpiresIn || expiresIn,
    "sec",
  );

  const verificationToken = generateId(24);

  await prisma.verification.create({
    data: {
      id: randomUUID(),
      value: userId,
      identifier: `reset-password:${verificationToken}`,
      expiresAt,
    },
  });

  return verificationToken;
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};

export type SignedInUser = Awaited<ReturnType<typeof getSignedInUser>>;
