import { create } from 'zustand';

import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  initialize: () => () => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  isInitialized: false,

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('LOG: Auth state changed:', _event);
      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  },

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
    }),
}));
