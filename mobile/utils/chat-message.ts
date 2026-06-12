export type ParsedRecord = {
  title: string;
  amount: number;
  createdAt?: string;
};

export function getMessageText(parts: Array<{ type: string; text?: string }>) {
  return parts
    .filter((part) => part.type === 'text' && part.text)
    .map((part) => part.text)
    .join('');
}

export function parseChatMessage(text: string) {
  const visibleText = stripJsonBlock(text);
  const jsonBlock = text.match(/```json\s*([\s\S]*?)\s*```/);

  const normalizeRecord = (record: ParsedRecord): ParsedRecord => ({
    ...record,
    amount: Math.round(Number(record.amount) * 100),
  });

  const buildRecordConfirmText = (record: ParsedRecord) => {
    const cents = Math.round(Number(record.amount) * 100);
    const yuan = (Math.abs(cents) / 100).toFixed(2);
    const typeLabel = cents >= 0 ? '收入' : '支出';

    return `已帮你记下「${record.title}」${typeLabel} ${yuan} 元～`;
  };

  if (jsonBlock) {
    try {
      const record = JSON.parse(jsonBlock[1]) as ParsedRecord;
      if (record.title && record.amount !== undefined) {
        const normalized = normalizeRecord(record);
        return {
          displayText: buildRecordConfirmText(record),
          record: normalized,
        };
      }
    } catch {
      // fall through
    }
  }

  try {
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const record = JSON.parse(clean) as ParsedRecord;
    if (record.title && record.amount !== undefined && record.createdAt) {
      const normalized = normalizeRecord(record);
      return {
        displayText: buildRecordConfirmText(record),
        record: normalized,
      };
    }
  } catch {
    // plain text
  }

  return { displayText: visibleText || text, record: null };
}

export function stripJsonBlock(text: string) {
  const idx = text.indexOf('```json');
  return (idx >= 0 ? text.slice(0, idx) : text).trim();
}

export function formatRecordAmount(cents: number) {
  const value = (Math.abs(Number(cents)) / 100).toFixed(2);
  return Number(cents) >= 0 ? `+${value}` : `-${value}`;
}
