import { router } from 'expo-router';
import { toast } from 'sonner-native';

import { supabase } from '@/lib/supabase';
import { mapAuthError } from '@/utils/auth-errors';

export function useAuth() {
  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName ?? '',
          last_name: lastName ?? '',
        },
      },
    });

    if (error) {
      console.log('ERROR: Sign up failed:', error.message);
      throw new Error(mapAuthError(error.message));
    }

    console.log('LOG: Sign up successful for', email);
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('ERROR: Sign in failed:', error.message);
      throw new Error(mapAuthError(error.message));
    }

    console.log('LOG: Sign in successful for', email);
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('ERROR: Sign out failed:', error.message);
      toast.error('Sign out failed', { description: error.message });
    } else {
      console.log('LOG: Signed out successfully');

      router.replace('/');
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.log('ERROR: Password reset failed:', error.message);
      throw new Error(mapAuthError(error.message));
    }

    console.log('LOG: Password reset email sent to', email);
    return true;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.log('ERROR: Password update failed:', error.message);
      throw new Error(mapAuthError(error.message));
    }

    console.log('LOG: Password updated successfully');
    return true;
  };

  return { signUp, signIn, signOut, resetPassword, updatePassword };
}
