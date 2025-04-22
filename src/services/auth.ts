// Placeholder for authentication service
// In a real application, this would handle user authentication and authorization
// against a database or other authentication provider.

import { User, UserRole } from "@/types/user";

const mockUsers: Record<string, User> = {
  "1": { id: "1", name: "User 1", email: "user1@example.com", role: "user" },
  "2": {
    id: "2",
    name: "Operator 1",
    email: "operator1@example.com",
    role: "operator",
  },
  "3": {
    id: "3",
    name: "Admin 1",
    email: "admin1@example.com",
    role: "administrator",
  },
};

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  // In a real implementation, you would query a database to validate the user.
  // For this example, we use mock data.
  const user = Object.values(mockUsers).find((user) => user.email === email);

  if (user) {
    // Here you would typically validate the password.
    return user;
  }

  return null;
};

export const authorize = (
  userRole: UserRole,
  requiredRole: UserRole,
): boolean => {
  // Check if the user has the required role
  return userRole === requiredRole || userRole === "administrator"; // Admins have all permissions
};

export const getUserById = async (userId: string): Promise<User | null> => {
  return mockUsers[userId] || null;
};
