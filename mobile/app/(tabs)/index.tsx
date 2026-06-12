import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import RecordCard from '@/components/RecordCard';
import { useAuthStore } from '@/stores/auth-store';
import { useRecordStore } from '@/stores/record-store';

function formatAmount(cents: number) {
  return (Math.abs(cents) / 100).toFixed(2);
}

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const records = useRecordStore((state) => state.records);
  const loading = useRecordStore((state) => state.loading);
  const error = useRecordStore((state) => state.error);
  const fetchRecords = useRecordStore((state) => state.fetchRecords);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadRecords = useCallback(() => {
    if (user?.id) {
      fetchRecords(date, user.id);
    }
  }, [date, fetchRecords, user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
  );

  return (
    <SafeAreaView className="mx-4 flex-1 gap-4" edges={['top', 'left', 'right']}>
      <View className="flex flex-row items-center justify-between">
        <Text className="font-bold">{date.toLocaleDateString()}</Text>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <Text className="text-primary">选择日期</Text>
        </Pressable>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="inline"
          onChange={(event, selectedDate) => {
            if (selectedDate && event.type === 'set') {
              setDate(selectedDate);
              setShowDatePicker(false);
            }
          }}
        />
      )}

      <View className="h-1/8 flex flex-row justify-between gap-2">
        <View className="flex-1 flex items-center justify-between rounded-lg bg-green-50 p-4">
          <View className="w-full flex flex-row justify-between">
            <Text className="font-bold">收入</Text>
            <Text className="text-green-500">
              {formatAmount(
                records
                  .filter((record) => record.amount > 0)
                  .reduce((acc, record) => acc + record.amount, 0)
              )}
            </Text>
          </View>
        </View>
        <View className="flex-1 flex items-center justify-between rounded-lg bg-red-50 p-4">
          <View className="w-full flex flex-row justify-between">
            <Text className="font-bold">支出</Text>
            <Text className="text-red-500">
              {formatAmount(
                records
                  .filter((record) => record.amount < 0)
                  .reduce((acc, record) => acc + record.amount, 0)
              )}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-1 gap-4 rounded-lg bg-gray-100 py-4">
        <Text className="px-4 text-gray-500">详细记录</Text>

        {loading ? (
          <ActivityIndicator className="mt-4" />
        ) : error ? (
          <Text className="px-4 text-red-500">{error}</Text>
        ) : records.length === 0 ? (
          <Text className="px-4 text-gray-400">暂无记录</Text>
        ) : (
          <ScrollView className="flex-1 px-4">
            {records.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
