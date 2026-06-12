import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const MAX_PROMPTS = 3;

function storageKey(userId: string) {
  return `chat-recent-prompts:${userId}`;
}

type RecentPromptState = {
  prompts: string[];
  load: (userId: string) => Promise<void>;
  add: (userId: string, prompt: string) => Promise<void>;
  reset: () => void;
};

export const useRecentPromptStore = create<RecentPromptState>((set, get) => ({
  prompts: [],
  load: async (userId) => {
    const raw = await AsyncStorage.getItem(storageKey(userId));
    const prompts: string[] = raw ? JSON.parse(raw) : [];
    set({ prompts });
  },
  add: async (userId, prompt) => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      return;
    }

    const next = [trimmed, ...get().prompts.filter((item) => item !== trimmed)].slice(
      0,
      MAX_PROMPTS,
    );
    set({ prompts: next });
    await AsyncStorage.setItem(storageKey(userId), JSON.stringify(next));
  },
  reset: () => set({ prompts: [] }),
}));
