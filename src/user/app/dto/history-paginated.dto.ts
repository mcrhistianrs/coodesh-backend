interface HistoryItem {
  word: string;
  added: Date;
}

class HistoryOutputPaginated {
  results: HistoryItem[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export { HistoryItem, HistoryOutputPaginated };
