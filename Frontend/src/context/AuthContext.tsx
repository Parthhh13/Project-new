// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser } from "@/api/authApi"; // real backend login
import { useToast } from "@/components/ui/use-toast";
import { AuthState, User } from "@/types";

// Default auth state with auto-authentication for development
const defaultAuthState: AuthState = {
  user: {
    id: "temp-user-id",
    name: "Test User",
    email: "test@example.com",
    role: "admin" // giving admin role for full access
  },
  token: "temp-token",
  isAuthenticated: true, // Always authenticated
  isLoading: false,
  error: null,
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const { toast } = useToast();

  // Initialize auth - always authenticated for development
  useEffect(() => {
    setAuthState(defaultAuthState);
  }, []);

  // Login function (bypassed for development)
  const login = async (email: string, password: string) => {
    // Automatically "login" without API call
    setAuthState(defaultAuthState);
    toast({
      title: "Login successful",
      description: "Welcome to the dashboard!",
    });
  };

  // Logout function (still functional but will re-authenticate on next render)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState(defaultAuthState);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
