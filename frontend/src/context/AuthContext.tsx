"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import * as jose from "jose";

export const ADMIN_ROLES = ["admin", "superadmin", "admin_kaset", "admin_psdm", "admin_bph"];
export const isAdminRole = (role?: unknown) => typeof role === "string" && ADMIN_ROLES.includes(role);

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
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const storedToken = getCookie("fkhk_token");
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
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `fkhk_token=${newToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    localStorage.setItem("fkhk_member", JSON.stringify(newMember));
    setToken(newToken);
    setMember(newMember);
    window.location.href = isAdminRole(newMember.role) ? "/admin" : "/dashboard";
  };

  const handleLogout = () => {
    document.cookie = "fkhk_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("fkhk_member");
    setToken(null);
    setMember(null);
    router.push("/");
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
