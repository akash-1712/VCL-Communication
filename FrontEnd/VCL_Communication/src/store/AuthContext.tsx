import { createContext } from "react";

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

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  login: (data: LoginCredentials) => Promise<void>;
  logout: () => void;
  signUp: (data: SignUpCredentials) => Promise<void>;
  role: UserRole;
  username: string | null;
}

const initialToken = localStorage.getItem("token") || null;
const username = localStorage.getItem("username") || null;
const role = (localStorage.getItem("role") as UserRole) || "visitor";

const initialAuthValue: AuthContextType = {
  token: initialToken,
  isLoggedIn: !!initialToken,
  login: async () => {},
  logout: () => {},
  signUp: async () => {},
  role: role,
  username: username,
};

const AuthContext = createContext(initialAuthValue);

export default AuthContext;
