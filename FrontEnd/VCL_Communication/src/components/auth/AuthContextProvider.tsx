import { ReactNode, useState } from "react";
import {
  toastifyError,
  toastifySuccess,
} from "../../Helpers/notificationToastify";
import AuthContext from "../../store/AuthContext";

interface AuthContextProviderProps {
  children: ReactNode;
}

interface LoginCredentials {
  username: string;
  password: string;
}

type UserRole = "visitor" | "student" | "staff";

interface SignUpCredentials {
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const token: string | null = localStorage.getItem("token") || null;
  const usernameStored: string | null =
    localStorage.getItem("username") || null;
  const roleStored = (localStorage.getItem("role") as UserRole) || "visitor";
  const [authToken, setAuthToken] = useState<string | null>(token);
  const [role, setRole] = useState<UserRole>(roleStored);
  const [username, setUsername] = useState<string | null>(usernameStored);

  async function login(data: LoginCredentials): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const resData: {
        message: string;
        token: string;
        name: string;
        role: UserRole;
      } = await response.json();

      if (!response.ok) {
        throw new Error(resData.message);
      }

      localStorage.setItem("token", resData.token || "");
      localStorage.setItem("username", resData.name);
      localStorage.setItem("role", resData.role);
      setAuthToken(resData.token || null);
      setRole(resData.role || "visitor");
      setUsername(resData.name);
      toastifySuccess(resData.message);
    } catch (error) {
      toastifyError((error as Error).message || "Internal Error");
      throw error;
    }
  }

  function logout() {
    setAuthToken(null);
    setRole("student");
    localStorage.removeItem("token");
  }

  async function signUp(data: SignUpCredentials): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const resData: {
        message: string;
        token: string;
        name: string;
        role: UserRole;
      } = await response.json();
      if (!response.ok) {
        throw new Error(resData.message);
      }
      localStorage.setItem("token", resData.token);
      localStorage.setItem("username", resData.name);
      localStorage.setItem("role", resData.role);
      setAuthToken(resData?.token || null);
      setRole(resData?.role || "visitor");
      setUsername(resData?.name);
      toastifySuccess(resData.message);
    } catch (error) {
      toastifyError((error as Error).message || "Internal Error");
      throw error;
    }
  }

  const authCtxValue = {
    token: authToken,
    isLoggedIn: !!authToken,
    login,
    logout,
    signUp,
    role,
    username,
  };

  return (
    <AuthContext.Provider value={authCtxValue}>{children}</AuthContext.Provider>
  );
}
