import { request } from './service';
import type { BillRecord, GetRecordsParams } from '@/types';

const recordAPI = {
  /**
   * 查询账单列表
   * POST /records
   */
  getRecords: (params: GetRecordsParams) => {
    return request<BillRecord[]>({
      method: 'POST',
      url: '/records',
      data: {
        user_id: params.userId,
        date: params.date,
      },
    });
  },
};

export default recordAPI;
