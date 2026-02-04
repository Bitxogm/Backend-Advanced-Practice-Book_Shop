export interface BookCreatePayload {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: string;
  userId: string;
}

export default BookCreatePayload;
