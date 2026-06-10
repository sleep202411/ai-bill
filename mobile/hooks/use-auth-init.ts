import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { Alert } from 'react-native';

import { getAuthErrorMessage, handleAuthRedirectUrl } from '@/lib/auth-redirect';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';

async function handleIncomingUrl(url: string) {
  try {
    const result = await handleAuthRedirectUrl(url);

    if (result === 'session') {
      Alert.alert('验证成功', '邮箱已验证，你现在可以登录了。');
    }
  } catch (error) {
    const message =
      error instanceof Error ? getAuthErrorMessage(url) || error.message : '验证失败';

    Alert.alert('验证失败', message);
  }
}

export function useAuthInit() {
  const syncFromClaims = useAuthStore((state) => state.syncFromClaims);

  useEffect(() => {
    syncFromClaims();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(() => {
      syncFromClaims();
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        void handleIncomingUrl(url);
      }
    });

    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      void handleIncomingUrl(url);
    });

    return () => {
      authSubscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, [syncFromClaims]);
}
