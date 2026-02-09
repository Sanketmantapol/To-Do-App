import { admin, user, ac } from "@/src/lib/auth/access";
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
      },
    }),
  ],
});

const {
  resetPassword,
  changePassword,
  signOut,
  sendVerificationEmail,
  requestPasswordReset: forgetPassword,
  accountInfo,
} = authClient;

export {
  resetPassword,
  changePassword,
  signOut,
  sendVerificationEmail,
  forgetPassword,
  accountInfo,
};

export const signIn = authClient.signIn.email;

export const isAuthenticated = () =>
  authClient.getSession().then((session) => !!session.data?.user);

export const getSignedInUser = async () => {
  const session = await authClient.getSession();

  if (session.error) {
    if (process.env.NODE_ENV === "development") {
      console.error(session.error);
    }

    throw new Error("User is not signed in");
  }

  if (!session.data?.user) {
    throw new Error("User is not signed in");
  }

  return session.data.user;
};
