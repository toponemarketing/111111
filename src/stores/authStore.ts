import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { shouldUseSampleData, initializeSampleUser } from '../lib/sampleData';

interface AuthState {
  user: any | null;
  profile: any | null;
  loading: boolean;
  useSampleData: boolean;
  setUser: (user: any | null) => void;
  setProfile: (profile: any | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  useSampleData: shouldUseSampleData(),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  }
}));

// Initialize auth state
export const initializeAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    useAuthStore.getState().setUser(session.user);
    
    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    useAuthStore.getState().setProfile(profile);
  } else if (shouldUseSampleData()) {
    // Use sample data in development if no Supabase connection
    const sampleUser = initializeSampleUser();
    if (sampleUser) {
      useAuthStore.getState().setUser(sampleUser);
      useAuthStore.getState().setProfile(sampleUser.profile);
    }
  }
  
  useAuthStore.getState().setLoading(false);
  
  // Set up auth state change listener
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      useAuthStore.getState().setUser(session.user);
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      useAuthStore.getState().setProfile(profile);
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setProfile(null);
    }
  });
};
