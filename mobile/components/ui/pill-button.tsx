import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { colors, gradients } from '@/constants/theme';

type PillButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export function PillButton({
  label,
  loading = false,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}: PillButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      className={`overflow-hidden rounded-pill active:opacity-90 ${isPrimary ? '' : 'border-[1.5px] border-border'} ${isDisabled ? 'opacity-55' : ''} ${className}`}
      {...props}
    >
      <LinearGradient
        colors={isPrimary ? [...gradients.primaryButton] : [...gradients.secondaryButton]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className="min-h-[50px] items-center justify-center px-6"
      >
        {loading ? (
          <ActivityIndicator color={isPrimary ? colors.textOnPrimary : colors.accent} size="small" />
        ) : (
          <Text
            className={`text-base font-semibold ${isPrimary ? 'text-white' : 'text-accent'}`}
          >
            {label}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
