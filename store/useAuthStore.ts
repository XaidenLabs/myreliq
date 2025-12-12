import { create } from "zustand";
import { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const { data } = await res.json();
        set({ user: data });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      set({ user: null });
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
}));
