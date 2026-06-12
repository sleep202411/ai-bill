import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { colors } from '@/constants/theme';

type ChatInputBarProps = {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ChatInputBar({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = '请输入记账内容...',
}: ChatInputBarProps) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View
      className="flex-row items-center gap-2 rounded-pill px-3 py-2"
      style={{
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderLight,
      }}
    >
      <Pressable className="h-9 w-9 items-center justify-center rounded-full bg-bg-bottom">
        <Ionicons name="scan-outline" size={20} color={colors.accent} />
      </Pressable>

      <TextInput
        className="flex-1 px-1 py-2 text-[15px] text-text-primary"
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        value={value}
        onChangeText={onChange}
        editable={!disabled}
        returnKeyType="send"
        onSubmitEditing={() => {
          if (canSend) {
            onSend();
          }
        }}
      />

      <Pressable
        disabled={!canSend}
        onPress={onSend}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{
          backgroundColor: canSend ? colors.primary : colors.disabled,
        }}
      >
        <Ionicons
          name={canSend ? 'send' : 'mic-outline'}
          size={18}
          color={colors.textOnPrimary}
        />
      </Pressable>
    </View>
  );
}
