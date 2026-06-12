import { Text, View } from 'react-native';

import {
  formatRecordAmount,
  parseChatMessage,
  type ParsedRecord,
} from '@/utils/chat-message';
import { colors } from '@/constants/theme';

type ChatMessageBubbleProps = {
  role: 'user' | 'assistant' | 'system';
  parts: Array<{ type: string; text?: string }>;
  isStreaming?: boolean;
};

function RecordCard({ record }: { record: ParsedRecord }) {
  const isIncome = Number(record.amount) > 0;

  return (
    <View
      className="mt-2 rounded-2xl bg-white px-4 py-3"
      style={{ borderWidth: 1, borderColor: colors.cardBorder }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold text-text-primary">{record.title}</Text>
          <Text className="mt-1 text-xs text-text-secondary">记账成功</Text>
        </View>
        <Text
          className="text-lg font-bold"
          style={{ color: isIncome ? '#22C55E' : colors.primaryDark }}
        >
          {formatRecordAmount(Number(record.amount))}
        </Text>
      </View>
    </View>
  );
}

export function ChatMessageBubble({ role, parts, isStreaming }: ChatMessageBubbleProps) {
  const text = parts
    .filter((part) => part.type === 'text' && part.text)
    .map((part) => part.text)
    .join('');

  if (!text && !isStreaming) {
    return null;
  }

  const isUser = role === 'user';
  const parsed = isUser ? null : parseChatMessage(text);
  const isRecordStream = !isUser && isStreaming && text.includes('```json');
  const visibleText = isUser
    ? text
    : isStreaming
      ? isRecordStream
        ? ''
        : text
      : parsed?.displayText ?? text;
  const record = isUser || isStreaming ? null : parsed?.record ?? null;

  return (
    <View className={`mb-3 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
      <View
        className={`max-w-[82%] rounded-3xl px-4 py-3 ${isUser ? 'rounded-br-md' : 'rounded-bl-md'}`}
        style={{
          backgroundColor: isUser ? colors.primaryLight : colors.white,
          borderWidth: isUser ? 0 : 1,
          borderColor: colors.cardBorder,
        }}
      >
        {!!visibleText && (
          <Text
            className={`text-[15px] leading-6 ${isUser ? 'text-text-primary' : 'text-text-primary'}`}
          >
            {visibleText}
            {isStreaming && (
              <Text style={{ color: colors.primary }}>|</Text>
            )}
          </Text>
        )}

        {!isUser && record && !isStreaming && <RecordCard record={record} />}

        {isStreaming && !visibleText && (
          <Text className="text-[15px] text-text-secondary">稍等，我在帮你记...</Text>
        )}
      </View>
    </View>
  );
}
