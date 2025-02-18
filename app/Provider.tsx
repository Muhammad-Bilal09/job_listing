import React from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
const AuthProvider = async ({ children }: any) => {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <SessionProvider session={session}>{children}</SessionProvider>
    </div>
  );
};

export default AuthProvider;
