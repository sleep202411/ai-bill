import { create } from 'zustand';

import { getErrorMessage, recordAPI, type BillRecord } from '@/services';

export type { BillRecord };

type RecordState = {
  records: BillRecord[];
  loading: boolean;
  error: string | null;
  fetchRecords: (date: Date, userId: string) => Promise<void>;
};

export const useRecordStore = create<RecordState>((set) => ({
  records: [],
  loading: false,
  error: null,

  fetchRecords: async (date, userId) => {
    if (!userId) {
      set({ records: [], error: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const dateStr = date.toISOString().split('T')[0];
      const data = await recordAPI.getRecords({ userId, date: dateStr });
      set({ records: data, loading: false });
    } catch (error) {
      set({ records: [], loading: false, error: getErrorMessage(error) });
    }
  },
}));
