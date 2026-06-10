import { LinearGradient } from 'expo-linear-gradient';
import { type ViewProps } from 'react-native';

import { gradients } from '@/constants/theme';

type ScreenBackgroundProps = ViewProps & {
  children: React.ReactNode;
  className?: string;
};

export function ScreenBackground({ children, className, ...props }: ScreenBackgroundProps) {
  return (
    <LinearGradient colors={[...gradients.screen]} className={className ?? 'flex-1'} {...props}>
      {children}
    </LinearGradient>
  );
}
