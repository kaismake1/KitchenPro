import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient } from "../../utils/apiClient";

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "shipper";
  fullname?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; role?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
    fullname?: string,
    phone?: string,
    address?: string,
  ) => Promise<{ success: boolean; role?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isShipper: boolean;
  isLoading: boolean;
  accessToken: string | null;
  updateUserProfile?: (data: {
    email?: string;
    fullname?: string;
    phone?: string;
    address?: string;
  }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage utilities (minimal - only for hydration)
const TokenManager = {
  setToken(token: string): void {
    try {
      localStorage.setItem("access_token", token);
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  },
  getToken(): string | null {
    try {
      return localStorage.getItem("access_token");
    } catch {
      return null;
    }
  },
  clearToken(): void {
    try {
      localStorage.removeItem("access_token");
    } catch (error) {
      console.error("Failed to clear token:", error);
    }
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydration: Load token from localStorage and verify with backend
  useEffect(() => {
    const loadUser = async () => {
      const token = TokenManager.getToken();
      if (token) {
        try {
          const userData = await apiClient.get("/auth/me");
          setUser(userData);
          setAccessToken(token);
        } catch (error) {
          console.error("Failed to verify token:", error);
          TokenManager.clearToken();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; role?: string }> => {
    try {
      const data = await apiClient.post("/auth/login", {
        username,
        password,
      });

      const userObj: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      };

      TokenManager.setToken(data.access_token);
      setAccessToken(data.access_token);
      setUser(userObj);
      return { success: true, role: data.role };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    fullname?: string,
    phone?: string,
    address?: string,
  ): Promise<{ success: boolean; role?: string }> => {
    try {
      const data = await apiClient.post("/auth/register", {
        username,
        email,
        password,
        fullname,
        phone,
        address,
      });

      const userObj: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      };

      TokenManager.setToken(data.access_token);
      setAccessToken(data.access_token);
      setUser(userObj);
      return { success: true, role: data.role };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false };
    }
  };

  const logout = () => {
    TokenManager.clearToken();
    setAccessToken(null);
    setUser(null);
  };

  const updateUserProfile = (data: {
    email?: string;
    fullname?: string;
    phone?: string;
    address?: string;
  }) => {
    if (user) {
      setUser({
        ...user,
        email: data.email || user.email,
        fullname: data.fullname || user.fullname,
        phone: data.phone || user.phone,
        address: data.address || user.address,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin: user?.role === "admin",
        isShipper: user?.role === "shipper",
        isLoading,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
