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
// The base URL is now loaded dynamically at runtime
const getIdentityServerConfig = () => {
  // Try to get the base URL from window.__IDENTITY_SERVER_BASE_URL__ (set via external script)
  const baseUrl = (window as any).__IDENTITY_SERVER_BASE_URL__ || "https://co.visual.com";
  
  return {
    baseUrl,
    authorizeEndpoint: "security/connect/authorize",
    tokenEndpoint: "security/connect/token",
    userInfoEndpoint: "security/connect/userinfo",
    endSessionEndpoint: "security/connect/endsession",
    clientId: "com.visual.galaxy.com",
    redirectUri: window.location.origin + "/auth-callback",
    postLogoutRedirectUri: window.location.origin,
    scope: "openid profile email impersonate",
    responseType: "code",
    usePkce: true,
  };
};

// PKCE helper functions
const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const authService = {
  // Generate the authorization URL
  getAuthorizationUrl: async (): Promise<string> => {
    const config = getIdentityServerConfig();
    
    // Generate and store code verifier for PKCE
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem('code_verifier', codeVerifier);
    
    // Generate code challenge
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: config.responseType,
      scope: config.scope,
      state: authService.generateState(),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${config.baseUrl}/${config.authorizeEndpoint}?${params.toString()}`;
  },

  // Generate a random state parameter to prevent CSRF attacks
  generateState: (): string => {
    const state = Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
    // Store state in localStorage to verify when the server returns
    localStorage.setItem('auth_state', state);
    return state;
  },

  // Redirect to identity server login
  redirectToLogin: async (): Promise<void> => {
    const authUrl = await authService.getAuthorizationUrl();
    window.location.href = authUrl;
  },

  // Handle the code and state from the identity server callback
  handleAuthCallback: async (code: string, state: string): Promise<User | null> => {
    try {
      // Verify state matches the one we stored
      const storedState = localStorage.getItem('auth_state');
      if (state !== storedState) {
        throw new Error("Invalid state parameter");
      }
      
      // Get code verifier for PKCE
      const codeVerifier = localStorage.getItem('code_verifier');
      if (!codeVerifier) {
        throw new Error("Code verifier not found");
      }
      
      const config = getIdentityServerConfig();
      
      // In a real implementation, would exchange the code for tokens using the code verifier
      // and the proper endpoints from config
      // For demo purposes, we're still simulating a successful authentication
      
      // Mock successful token exchange
      const user: User = {
        id: "user-123",
        username: "demo_user",
        email: "demo@example.com",
        roles: ["employee"],
        token: "mock-jwt-token-" + Math.random().toString(36).substring(2)
      };
      
      // Clean up localStorage items used for authentication
      localStorage.removeItem('auth_state');
      localStorage.removeItem('code_verifier');
      
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
        await authService.redirectToLogin();
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
    
    const config = getIdentityServerConfig();
    
    // Redirect to identity server end session endpoint
    const params = new URLSearchParams({
      post_logout_redirect_uri: config.postLogoutRedirectUri,
    });
    
    const endSessionUrl = `${config.baseUrl}/${config.endSessionEndpoint}?${params.toString()}`;
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
