import NextAuth from "next-auth"

declare module "next-auth" {

  interface User {
    username: string | null;
    email: string;
  };

  interface Session {
    user: User & {
      username: string | null;
      email: string;
    };
    token: {
      username: string;
    };
  };
};