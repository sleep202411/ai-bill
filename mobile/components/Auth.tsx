import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginMascot } from '@/components/icons/login-mascot';
import { PillButton } from '@/components/ui/pill-button';
import { ScreenBackground } from '@/components/ui/screen-background';
import { translateAuthError } from '@/lib/auth-errors';
import { getAuthRedirectUrl } from '@/lib/auth-redirect';
import { supabase } from '@/lib/supabase';

type LoadingAction = 'signIn' | 'signUp' | null;

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const loading = loadingAction !== null;

  async function signInWithEmail() {
    setLoadingAction('signIn');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('登录失败', translateAuthError(error.message));
    }
    setLoadingAction(null);
  }

  async function signUpWithEmail() {
    setLoadingAction('signUp');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
      },
    });

    if (error) {
      Alert.alert('注册失败', translateAuthError(error.message));
    } else if (!data.session) {
      Alert.alert(
        '请查收验证邮件',
        '我们已向你的邮箱发送了确认链接。点击后会自动回到 App 完成验证。'
      );
    } else {
      Alert.alert('注册成功', '账号已创建，你现在可以使用了。');
    }
    setLoadingAction(null);
  }

  return (
    <ScreenBackground className="flex-1">
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerClassName="grow px-6 pt-6 pb-8"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-6 items-center px-1">
              <LoginMascot size={80} className="mb-2" />
              <Text className="mb-2 text-center text-[28px] font-bold text-text-primary">
                小x智能记账
              </Text>
              <Text className="text-center text-[15px] leading-[22px] text-text-secondary">
                欢迎回来，登录或注册开始记账
              </Text>
            </View>

            <View className="rounded-card border-[1.5px] border-surface-border bg-surface p-6 shadow-sm">
              <View className="mb-4">
                <Text className="mb-2 text-[15px] font-semibold text-text-secondary">邮箱</Text>
                <TextInput
                  onChangeText={setEmail}
                  value={email}
                  placeholder="请输入邮箱"
                  placeholderTextColor="#C9B8C0"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="rounded-2xl border-[1.5px] border-border-light bg-white px-4 py-3.5 text-base text-text-primary"
                  editable={!loading}
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-[15px] font-semibold text-text-secondary">密码</Text>
                <TextInput
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry
                  placeholder="请输入密码"
                  placeholderTextColor="#C9B8C0"
                  autoCapitalize="none"
                  className="rounded-2xl border-[1.5px] border-border-light bg-white px-4 py-3.5 text-base text-text-primary"
                  editable={!loading}
                />
              </View>

              <View className="mt-2 gap-4">
                <PillButton
                  label="登录"
                  variant="primary"
                  loading={loadingAction === 'signIn'}
                  disabled={loading}
                  onPress={signInWithEmail}
                />
                <PillButton
                  label="注册"
                  variant="secondary"
                  loading={loadingAction === 'signUp'}
                  disabled={loading}
                  onPress={signUpWithEmail}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}
