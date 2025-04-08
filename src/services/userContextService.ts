
import { toast } from "sonner";

export interface UserContext {
  organizationalUnit: string;
  role: string;
  username: string;
}

// The base URL is loaded dynamically at runtime
const getApiBaseUrl = () => {
  return (window as any).__APP_API_URL__ || "https://api.example.com";
};

export const userContextService = {
  // Fetch user context information
  getUserContexts: async (): Promise<UserContext[]> => {
    try {
      const baseURL = getApiBaseUrl();
      
      const response = await fetch(`${baseURL}/v1/me/contexts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('currentUserToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user contexts: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user contexts:", error);
      toast.error("Failed to load user information");
      return [];
    }
  }
};
