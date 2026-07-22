"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import * as jose from "jose";

interface Member {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  member: Member | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, member: Member) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get("fkhk_token");
    const storedMember = localStorage.getItem("fkhk_member");

    if (storedToken) {
      if (storedMember) {
        try {
          if (storedToken.startsWith("mock_token_")) {
            setToken(storedToken);
            setMember(JSON.parse(storedMember));
          } else {
            const decoded = jose.decodeJwt(storedToken);
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
              handleLogout(); setLoading(false); return;
            }
            setToken(storedToken);
            setMember(JSON.parse(storedMember));
          }
        } catch { handleLogout(); }
      } else {
        // Token exists but no localStorage — fetch from API
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
          .then((r) => {
            if (!r.ok) throw new Error("Unauthorized");
            return r.json();
          })
          .then((m) => {
            setToken(storedToken);
            setMember(m);
            localStorage.setItem("fkhk_member", JSON.stringify(m));
          })
          .catch(() => handleLogout())
          .finally(() => setLoading(false));
        return;
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (newToken: string, newMember: Member) => {
    Cookies.set("fkhk_token", newToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
    });
    localStorage.setItem("fkhk_member", JSON.stringify(newMember));
    setToken(newToken);
    setMember(newMember);
    router.push(newMember.role === "admin" ? "/admin" : "/dashboard");
  };

  const handleLogout = () => {
    Cookies.remove("fkhk_token");
    localStorage.removeItem("fkhk_member");
    setToken(null);
    setMember(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        member,
        token,
        isAuthenticated: !!token,
        login: handleLogin,
        logout: handleLogout,
        loading,
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
