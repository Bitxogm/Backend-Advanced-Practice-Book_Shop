export interface BookUpdateQuery {
  title?: string;
  description?: string;
  price?: number;
  author?: string;
  status?: 'PUBLISHED' | 'SOLD';
  ownerId?: string;
  soldAt?: Date | null;
}

export default BookUpdateQuery;
