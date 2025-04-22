export type UserRole = "user" | "operator" | "administrator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
