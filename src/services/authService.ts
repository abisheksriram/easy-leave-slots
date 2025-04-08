
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

// Identity server configuration
const IDENTITY_SERVER_CONFIG = {
  baseUrl: "https://co.visual.com",
  authorizeEndpoint: "security/connect/authorize",
  tokenEndpoint: "security/connect/token",
  userInfoEndpoint: "security/connect/userinfo",
  endSessionEndpoint: "security/connect/endsession",
  clientId: "leave-booking-client",
  redirectUri: window.location.origin + "/auth-callback",
  postLogoutRedirectUri: window.location.origin,
  scope: "openid profile email",
  responseType: "code",
};

export const authService = {
  // Generate the authorization URL
  getAuthorizationUrl: (): string => {
    const params = new URLSearchParams({
      client_id: IDENTITY_SERVER_CONFIG.clientId,
      redirect_uri: IDENTITY_SERVER_CONFIG.redirectUri,
      response_type: IDENTITY_SERVER_CONFIG.responseType,
      scope: IDENTITY_SERVER_CONFIG.scope,
      state: authService.generateState(),
    });

    return `${IDENTITY_SERVER_CONFIG.baseUrl}/${IDENTITY_SERVER_CONFIG.authorizeEndpoint}?${params.toString()}`;
  },

  // Generate a random state parameter to prevent CSRF attacks
  generateState: (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  },

  // Redirect to identity server login
  redirectToLogin: (): void => {
    const authUrl = authService.getAuthorizationUrl();
    window.location.href = authUrl;
  },

  // Handle the code and state from the identity server callback
  handleAuthCallback: async (code: string, state: string): Promise<User | null> => {
    try {
      // In a real implementation, this would exchange the code for tokens
      // For demo purposes, we're simulating a successful authentication
      
      // Mock successful token exchange
      const user: User = {
        id: "user-123",
        username: "demo_user",
        email: "demo@example.com",
        roles: ["employee"],
        token: "mock-jwt-token-" + Math.random().toString(36).substring(2)
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      toast.success("Login successful");
      return user;
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Failed to authenticate");
      return null;
    }
  },
  
  // Login function (for backward compatibility - will redirect to identity server)
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    // For demo purposes, we still allow direct login with "demo" and "password"
    // In production, this would be removed and only the identity server flow would be used
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (credentials.username === "demo" && credentials.password === "password") {
        const user: User = {
          id: "user-123",
          username: credentials.username,
          email: "demo@example.com",
          roles: ["employee"],
          token: "mock-jwt-token-" + Math.random().toString(36).substring(2)
        };
        
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        toast.success("Login successful");
        return user;
      } else {
        // Redirect to identity server
        authService.redirectToLogin();
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
    
    // Redirect to identity server end session endpoint
    const params = new URLSearchParams({
      post_logout_redirect_uri: IDENTITY_SERVER_CONFIG.postLogoutRedirectUri,
    });
    
    const endSessionUrl = `${IDENTITY_SERVER_CONFIG.baseUrl}/${IDENTITY_SERVER_CONFIG.endSessionEndpoint}?${params.toString()}`;
    window.location.href = endSessionUrl;
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
