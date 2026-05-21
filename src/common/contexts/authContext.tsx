import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponseDto, Role } from "@/api/dtos/auth.dto";
import {
  clearStoredAuth,
  getStoredRole,
  getStoredToken,
  setStoredAuth,
} from "../utils/authStorage";

export interface AuthContextValue {
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isAuthResolved: boolean;
  setAuthSession: (data: AuthResponseDto, remember?: boolean) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseStoredRole = (value: string | null): Role | null => {
  if (value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : (parsed as Role);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    setToken(getStoredToken());
    setRole(parseStoredRole(getStoredRole()));
    setIsAuthResolved(true);
  }, []);

  const setAuthSession = useCallback(
    (data: AuthResponseDto, remember = true) => {
      setStoredAuth(data.accessToken, String(data.role), remember);
      setToken(data.accessToken);
      setRole(data.role);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setRole(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      role,
      isAuthenticated: Boolean(token),
      isAuthResolved,
      setAuthSession,
      signOut,
    }),
    [token, role, isAuthResolved, setAuthSession, signOut],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
