import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';
import { View, TextInput, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/stores/auth-store';

export default function App() {
  const user = useAuthStore(state => state.user);
  const [input, setInput] = useState('');
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `${process.env.EXPO_PUBLIC_OPENAI_API_URL}/chat`,
      body: {
        user_id: user?.id,
      },
    }),
    onError: (error: unknown) => console.error(error, 'ERROR'),
    messages: [
      {
        id: '1',
        role: 'assistant',
        parts: [{ 
          type: 'text', 
          text: '您好，请问需要记录什么消费?' 
        }],
      },
    ],
  });

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView className="flex-1 px-2" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="pb-2">
          {messages.map(m => (
            <View key={m.id} className="my-2">
              <View>
                <Text className="font-bold">{m.role}</Text>
                {m.parts.map((part: any, i: number) => {
                  switch (part.type) {
                    case 'text':
                      return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                  }
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="pb-2">
          <TextInput
            className="rounded-lg bg-white p-2"
            placeholder="Say something..."
            value={input}
            onChange={e => setInput(e.nativeEvent.text)}
            onSubmitEditing={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}