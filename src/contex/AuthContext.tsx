import { createContext, useEffect, useState, ReactNode } from "react";
import AuthContextType from "../interfaces/contextInterface";
import { isUserVerifed } from "../api/user";

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem("token");
      const authStatus = localStorage.getItem("isAuthenticated");

      if (storedToken && authStatus === "true") {
        setIsAuthenticated(true);
        setToken(storedToken);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  // Updated isUser function
  const isUser = async () => {
    try {
      const response = await isUserVerifed();
      if (response.data && response.data.user) {
        return {
          userId: response.data.user.id,
          departmentId: response.data.departmentId,
        };
      }
      return { userId: null, departmentId: null };
    } catch (error) {
      console.error("Error verifying user:", error);
      return { userId: null, departmentId: null };
    }
  };

  const login = (newToken: string) => {
    setIsAuthenticated(true);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, isUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
