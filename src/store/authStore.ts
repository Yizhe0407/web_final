// lib/authStore.ts
import { create } from 'zustand';

interface User {
  username: string;
  email?: string;
  // Add other user properties as needed
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  setLoggedIn: (value: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  setLoggedIn: (value: boolean) => set({ isLoggedIn: value }),
  setUser: (user: User | null) => set({ user, isLoggedIn: !!user }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));