import { Connection } from "mongoose";
import { DefaultSession } from "next-auth";

declare global {
  var __mongooseCache: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export {};
