
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, User, LoginCredentials } from "@/services/authService";
import { userContextService, UserContext } from "@/services/userContextService";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  userContexts: UserContext[];
  activeContext: UserContext | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  handleAuthCallback: (code: string, state: string) => Promise<boolean>;
  redirectToLogin: () => Promise<void>;
  setActiveUserContext: (context: UserContext) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userContexts, setUserContexts] = useState<UserContext[]>([]);
  const [activeContext, setActiveContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user contexts when user is authenticated
  useEffect(() => {
    const fetchUserContexts = async () => {
      if (user) {
        try {
          const contexts = await userContextService.getUserContexts();
          setUserContexts(contexts);
          
          // Set first context as active if available
          if (contexts.length > 0 && !activeContext) {
            setActiveContext(contexts[0]);
          }
        } catch (error) {
          console.error("Failed to fetch user contexts:", error);
        }
      }
    };

    fetchUserContexts();
  }, [user]);

  useEffect(() => {
    // Check if user is already logged in on app startup
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const setActiveUserContext = (context: UserContext) => {
    setActiveContext(context);
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const user = await authService.login(credentials);
      setUser(user);
      setLoading(false);
      return !!user;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setUserContexts([]);
    setActiveContext(null);
    navigate("/login");
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const handleAuthCallback = async (code: string, state: string): Promise<boolean> => {
    setLoading(true);
    try {
      const user = await authService.handleAuthCallback(code, state);
      setUser(user);
      setLoading(false);
      return !!user;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const redirectToLogin = async () => {
    await authService.redirectToLogin();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userContexts,
        activeContext,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        handleAuthCallback,
        redirectToLogin,
        setActiveUserContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
