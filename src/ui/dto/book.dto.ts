// DTO para la petición de creación de libro desde la API
export interface BookRequestDTO {
  title: string;
  description: string;
  price: number;
  author: string;
  ownerId: string;
}

// DTO para la petición de actualización de libro desde la API
export interface UpdateBookDTO {
  title?: string;
  description?: string;
  price?: number;
  author?: string;
  status?: 'PUBLISHED' | 'SOLD';
  ownerId?: string;
  soldAt?: Date | null;
}

// DTO para la respuesta de libro hacia la API
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
