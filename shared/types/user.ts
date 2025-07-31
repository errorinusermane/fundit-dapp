// shared/types/user.ts
export type UserRole = "user" | "company";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
}
