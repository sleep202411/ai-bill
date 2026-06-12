import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatInputBar } from '@/components/chat/ChatInputBar';
import { ChatMessageBubble } from '@/components/chat/ChatMessageBubble';
import { LoginMascot } from '@/components/icons/login-mascot';
import { ScreenBackground } from '@/components/ui/screen-background';
import { getMessageText, parseChatMessage } from '@/utils/chat-message';
import { colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';
import { useRecentPromptStore } from '@/stores/recent-prompt-store';
import { useRecordStore } from '@/stores/record-store';

const defaultQuickPrompts = ['午饭 35 元', '奶茶 18 元', '地铁 6 元'];

export default function ChatScreen() {
  const user = useAuthStore((state) => state.user);
  const fetchRecords = useRecordStore((state) => state.fetchRecords);
  const recentPrompts = useRecentPromptStore((state) => state.prompts);
  const loadRecentPrompts = useRecentPromptStore((state) => state.load);
  const addRecentPrompt = useRecentPromptStore((state) => state.add);
  const resetRecentPrompts = useRecentPromptStore((state) => state.reset);
  const quickPrompts = recentPrompts.length > 0 ? recentPrompts : defaultQuickPrompts;
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');

  const refreshRecords = useCallback(() => {
    if (user?.id) {
      fetchRecords(new Date(), user.id);
    }
  }, [fetchRecords, user?.id]);

  const { messages, error, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `${process.env.EXPO_PUBLIC_OPENAI_API_URL}/chat`,
      body: {
        user_id: user?.id,
      },
    }),
    onError: (err: unknown) => console.error(err, 'ERROR'),
    onFinish: ({ message }) => {
      const content = getMessageText(message.parts);
      const { record } = parseChatMessage(content);
      if (record) {
        refreshRecords();
      }
    },
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: '你好呀～我是小x，告诉我今天花了什么，我来帮你记账～',
          },
        ],
      },
    ],
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, status]);

  useEffect(() => {
    if (user?.id) {
      loadRecentPrompts(user.id);
      return;
    }
    resetRecentPrompts();
  }, [user?.id, loadRecentPrompts, resetRecentPrompts]);

  const handleSend = (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || isStreaming) {
      return;
    }

    if (user?.id) {
      addRecentPrompt(user.id, message);
    }
    sendMessage({ text: message });
    setInput('');
  };

  if (error) {
    return (
      <ScreenBackground>
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-text-primary">{error.message}</Text>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <View
          className="flex-row items-center gap-3 border-b px-4 py-3"
          style={{ borderColor: colors.divider, backgroundColor: 'rgba(255,255,255,0.72)' }}
        >
          <View
            className="h-10 w-10 items-center justify-center overflow-hidden rounded-full"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <LoginMascot size={34} />
          </View>
          <View>
            <Text className="text-base font-semibold text-text-primary">小x</Text>
            <Text className="text-xs text-text-secondary">
              {isStreaming ? '正在回复...' : '你的专属记账助手'}
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4"
          contentContainerClassName="py-4"
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => {
            const isLastAssistant =
              message.role === 'assistant' && index === messages.length - 1;

            return (
              <ChatMessageBubble
                key={message.id}
                role={message.role}
                parts={message.parts}
                isStreaming={isLastAssistant && isStreaming}
              />
            );
          })}
        </ScrollView>

        <View className="px-4 pb-3 pt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 pb-3"
          >
            {quickPrompts.map((prompt) => (
              <Pressable
                key={prompt}
                onPress={() => handleSend(prompt)}
                disabled={isStreaming}
                className="rounded-pill px-4 py-2"
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.borderLight,
                  opacity: isStreaming ? 0.5 : 1,
                }}
              >
                <Text className="text-sm text-text-primary">{prompt}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <ChatInputBar
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            disabled={isStreaming}
            placeholder="例如：咖啡 20 元"
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}
