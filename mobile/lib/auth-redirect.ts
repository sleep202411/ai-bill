import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

import { translateAuthError } from '@/lib/auth-errors';
import { supabase } from '@/lib/supabase';

export function getAuthRedirectUrl() {
  return Linking.createURL('/');
}

export async function handleAuthRedirectUrl(url: string): Promise<'session' | 'none'> {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode || params.error || params.error_code) {
    throw new Error(getAuthErrorMessage(url));
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (!accessToken) {
    return 'none';
  }

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    throw error;
  }

  return 'session';
}

export function getAuthErrorMessage(url: string) {
  const { params } = QueryParams.getQueryParams(url);
  const description = params.error_description;
  const code = params.error_code ?? params.error;

  if (description) {
    return translateAuthError(decodeURIComponent(description.replace(/\+/g, ' ')));
  }

  if (code === 'otp_expired') {
    return '验证链接已过期，请重新注册或重发验证邮件。';
  }

  return translateAuthError(code ?? '验证失败');
}
