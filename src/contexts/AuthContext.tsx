
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, User, LoginCredentials } from "@/services/authService";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  handleAuthCallback: (code: string, state: string) => Promise<boolean>;
  redirectToLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in on app startup
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

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
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        handleAuthCallback,
        redirectToLogin
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
