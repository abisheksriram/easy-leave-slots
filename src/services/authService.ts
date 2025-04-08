
import { toast } from "sonner";

// Interface for user data returned from identity server
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  token: string;
}

// Login credentials interface
export interface LoginCredentials {
  username: string;
  password: string;
}

// Mock identity server URL - replace with actual server URL in production
const IDENTITY_SERVER_URL = "https://api.example.com/auth";

export const authService = {
  // Login function
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    try {
      // In a real implementation, this would be an actual API call
      // For demo purposes, we're simulating a network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful authentication
      if (credentials.username === "demo" && credentials.password === "password") {
        const user: User = {
          id: "user-123",
          username: credentials.username,
          email: "demo@example.com",
          roles: ["employee"],
          token: "mock-jwt-token-" + Math.random().toString(36).substring(2)
        };
        
        // Store user in localStorage for persistence
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        toast.success("Login successful");
        return user;
      } else {
        toast.error("Invalid credentials");
        return null;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to authenticate");
      return null;
    }
  },
  
  // Logout function
  logout: (): void => {
    localStorage.removeItem("currentUser");
    toast.info("Logged out successfully");
  },
  
  // Get current authenticated user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("currentUser");
  },
  
  // Check if user has a specific role
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user?.roles.includes(role) || false;
  }
};
