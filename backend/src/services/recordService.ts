import { and, desc, eq, gte, lt } from 'drizzle-orm';

import { db } from '../db';
import { records } from '../db/schema';

export type RecordRow = typeof records.$inferSelect;

export type CreateRecordInput = {
  userId: string;
  title: string;
  amount: number;
  createdAt: Date;
};

export type UpdateRecordInput = {
  title?: string;
  amount?: number;
};

function toRecordResponse(record: RecordRow) {
  return {
    id: record.id,
    user_id: record.userId,
    title: record.title,
    amount: record.amount,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function getRecords(userId: string, date?: string) {
  const conditions = [eq(records.userId, userId)];

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    conditions.push(gte(records.createdAt, start), lt(records.createdAt, end));
  }

  const result = await db
    .select()
    .from(records)
    .where(and(...conditions))
    .orderBy(desc(records.createdAt));

  return result.map(toRecordResponse);
}

export async function createRecord(input: CreateRecordInput) {
  const [record] = await db
    .insert(records)
    .values({
      userId: input.userId,
      title: input.title,
      amount: input.amount,
    })
    .returning();

  return toRecordResponse(record);
}

export async function updateRecord(id: number, input: UpdateRecordInput) {
  const updates: Partial<Pick<RecordRow, 'title' | 'amount'>> = {};

  if (input.title !== undefined) {
    updates.title = input.title;
  }

  if (input.amount !== undefined) {
    updates.amount = input.amount;
  }

  if (Object.keys(updates).length === 0) {
    return null;
  }

  const [record] = await db
    .update(records)
    .set(updates)
    .where(eq(records.id, id))
    .returning();

  return record ? toRecordResponse(record) : null;
}

export async function deleteRecord(id: number) {
  const [deleted] = await db.delete(records).where(eq(records.id, id)).returning();
  return deleted ? toRecordResponse(deleted) : null;
}
