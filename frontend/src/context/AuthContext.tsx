"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import * as jose from "jose";

export const ADMIN_ROLES = ["admin", "superadmin", "admin_kaset", "admin_psdm", "admin_bph", "sekretaris"];
export const isAdminRole = (role?: unknown) => typeof role === "string" && ADMIN_ROLES.includes(role);

interface Member {
  id: number;
  email: string;
  name: string;
  role: string;
  mustChangePassword?: boolean;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Cookie ikut habis bersama token-nya, supaya tidak ada token kedaluwarsa yang tersimpan
const saveTokenCookie = (token: string) => {
  let expires = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  try {
    const { exp } = jose.decodeJwt(token);
    if (exp) expires = new Date(exp * 1000);
  } catch {}
  document.cookie = `fkhk_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const readTokenCookie = () =>
  document.cookie.split("; ").find((r) => r.startsWith("fkhk_token="))?.split("=")[1] || null;

// Halaman yang butuh login; di halaman publik sesi habis cukup dibersihkan diam-diam
const isInternalPath = (path: string) => /^\/(admin|dashboard|events\/create|newsletter)(\/|$)/.test(path);

// Hanya path internal, cegah open redirect lewat ?next=
const safeNext = (next: string | null) => (next && next.startsWith("/") && !next.startsWith("//") ? next : null);

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
              expireSession(); setLoading(false); return;
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

  // Sesi habis: bersihkan, lalu ke login dan kembali ke halaman ini setelah masuk lagi
  const expiringRef = useRef(false);
  const expireSession = () => {
    if (expiringRef.current) return;
    expiringRef.current = true;
    document.cookie = "fkhk_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("fkhk_member");
    setToken(null);
    setMember(null);
    if (!isInternalPath(window.location.pathname)) {
      expiringRef.current = false;
      return;
    }
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/auth/login?expired=1&next=${next}`;
  };

  // Perpanjang token selama halaman dipakai: dicek berkala dan saat tab kembali aktif.
  // Diperbarui begitu umur token tinggal kurang dari separuh.
  useEffect(() => {
    if (!token || token.startsWith("mock_token_")) return;
    let refreshing = false;
    const check = async () => {
      const current = readTokenCookie();
      if (!current) return expireSession();
      let exp = 0;
      let iat = 0;
      try {
        ({ exp = 0, iat = 0 } = jose.decodeJwt(current));
      } catch {
        return expireSession();
      }
      const now = Date.now() / 1000;
      if (exp <= now) return expireSession();
      if (refreshing || exp - now > (exp - iat) / 2) return;
      refreshing = true;
      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { Authorization: `Bearer ${current}` },
        });
        if (res.status === 401) return expireSession();
        if (res.ok) {
          const data = await res.json();
          saveTokenCookie(data.token);
          setToken(data.token);
        }
      } catch {
        // Offline sebentar: coba lagi di pengecekan berikutnya
      } finally {
        refreshing = false;
      }
    };
    check();
    const timer = setInterval(check, 5 * 60 * 1000);
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, [token]);

  // Request API mana pun yang ditolak karena token kedaluwarsa langsung diarahkan ke login,
  // bukan menampilkan "Token expired" di form.
  useEffect(() => {
    const original = window.fetch;
    window.fetch = async (...args) => {
      const res = await original(...args);
      if (res.status === 401) {
        const url = typeof args[0] === "string" ? args[0] : args[0] instanceof URL ? args[0].href : args[0].url;
        if (API_URL && url.startsWith(API_URL) && !url.includes("/api/auth/login")) {
          const body = await res.clone().json().catch(() => null);
          if (body?.message === "Token expired") expireSession();
        }
      }
      return res;
    };
    return () => {
      window.fetch = original;
    };
  }, []);

  const handleLogin = (newToken: string, newMember: Member) => {
    saveTokenCookie(newToken);
    localStorage.setItem("fkhk_member", JSON.stringify(newMember));
    setToken(newToken);
    setMember(newMember);
    const next = safeNext(new URLSearchParams(window.location.search).get("next"));
    window.location.href = next || (isAdminRole(newMember.role) ? "/admin" : "/dashboard");
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
