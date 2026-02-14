export class Book {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly author: string;
  readonly status: 'PUBLISHED' | 'SOLD';
  readonly ownerId: string;
  readonly soldAt: Date | null;
  readonly createdAt: Date = new Date();

  constructor({
    id,
    title,
    description,
    price,
    author,
    status,
    ownerId,
    soldAt,
  }: {
    id: string;
    title: string;
    description: string;
    price: number;
    author: string;
    status: 'PUBLISHED' | 'SOLD';
    ownerId: string;
    soldAt: Date | null;
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.author = author;
    this.status = status;
    this.ownerId = ownerId;
    this.soldAt = soldAt;
  }
}

export default Book;
