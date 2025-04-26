// src/context/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser } from "@/api/authApi"; // real backend login
import { useToast } from "@/components/ui/use-toast";
import { AuthState, User } from "@/types";

// Default auth state
const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
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

  // Initialize auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setAuthState({
        ...defaultAuthState,
        isLoading: false,
      });
    }
  }, []);

  // Login function (calls backend)
  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await loginUser(email, password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      setAuthState({
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast({
        title: "Login successful",
        description: `Welcome back, ${res.user.name}!`,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Login failed",
      }));

      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });

      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuthState({
      ...defaultAuthState,
      isLoading: false,
    });

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
