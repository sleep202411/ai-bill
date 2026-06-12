export type BillRecord = {
  id: number;
  user_id: string;
  title: string;
  amount: number;
  createdAt: string;
};

export type GetRecordsParams = {
  userId: string;
  date: string;
};
