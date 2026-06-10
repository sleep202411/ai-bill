import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

export type AuthUser = {
  id: string;
  email?: string;
};

type AuthState = {
  user: AuthUser | null;
  initialized: boolean;
  setUser: (user: AuthUser | null) => void;
  syncFromClaims: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user, initialized: true }),
  syncFromClaims: async () => {
    const { data } = await supabase.auth.getClaims();

    if (data?.claims?.sub) {
      set({
        user: {
          id: data.claims.sub,
          email: typeof data.claims.email === 'string' ? data.claims.email : undefined,
        },
        initialized: true,
      });
      return;
    }

    set({ user: null, initialized: true });
  },
}));
