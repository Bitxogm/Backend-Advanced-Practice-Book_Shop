export interface BookRequestDTO {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: string;
}

export interface UpdateBookDTO {
  title?: string;
  description?: string;
  price?: number;
  author?: string;
  status?: 'PUBLISHED' | 'SOLD';
  ownerId?: string;
  soldAt?: Date | null;
}

export interface BookResponseDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  author: string;
  status: 'PUBLISHED' | 'SOLD';
  ownerId: string;
  soldAt: Date | null;
}
