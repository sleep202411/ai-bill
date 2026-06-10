import Auth from '@/components/Auth';
import Account from '@/components/Account';
import { ScreenBackground } from '@/components/ui/screen-background';
import { useAuthStore } from '@/stores/auth-store';
import { View } from 'react-native';

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Auth />;
  }

  return (
    <ScreenBackground className="flex-1">
      <View className="flex-1">
        <Account key={user.id} userId={user.id} email={user.email} />
      </View>
    </ScreenBackground>
  );
}
