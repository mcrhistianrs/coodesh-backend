interface FavoriteItem {
  word: string;
  added: Date;
}

class FavoriteOutputPaginated {
  results: FavoriteItem[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export { FavoriteItem, FavoriteOutputPaginated };
