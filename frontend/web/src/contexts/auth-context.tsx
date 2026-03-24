import { ReactNode, createContext, useContext, useState } from "react";

export interface AuthUser {
  id: string;
  provider: string;
  email: string | null;
  name: string | null;
  profile_image: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "bodeum_auth_token";

const AuthContext = createContext<AuthContextValue | null>(null);

function parseJwtPayload(token: string): AuthUser | null {
  try {
    const base64 = token.split(".")[1];
    const decoded = JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      id: decoded.sub,
      provider: decoded.provider,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
      profile_image: decoded.profile_image ?? null,
    };
  } catch {
    return null;
  }
}

function loadInitialState(): AuthState {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!token) return { user: null, token: null };
  const user = parseJwtPayload(token);
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, token: null };
  }
  return { user, token };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  const login = (token: string) => {
    const user = parseJwtPayload(token);
    if (!user) return;
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    setState({ user, token });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setState({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
