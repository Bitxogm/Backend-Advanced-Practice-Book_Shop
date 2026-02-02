export interface BookCreatePayload {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: string;
}

export default BookCreatePayload;
