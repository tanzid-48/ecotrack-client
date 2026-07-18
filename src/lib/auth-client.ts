import { createAuthClient } from "better-auth/react";
import { saveAuthToken } from "./api/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token");
      if (authToken) {
        saveAuthToken(authToken);
      }
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
