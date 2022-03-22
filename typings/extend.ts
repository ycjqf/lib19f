declare module "express-session" {
  interface SessionData {
    data: { id: number; capacity: "user" | "admin" | "reviewer" };
  }
}

export {};
