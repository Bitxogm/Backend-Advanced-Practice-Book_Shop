import { Book } from '@domain/entities/Book';
import { IBookRepository } from '@domain/repositories/BookRepository';
import type { UserRepository } from '@domain/repositories/UserRepository';
import type { EmailService } from '@domain/services/EmailService';
import { ERROR_MESSAGES } from '@config/constants';

interface BuyBookInput {
  bookId: string;
  userId: string;
}

export class BuyBookUseCase {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  async execute({ bookId, userId }: BuyBookInput): Promise<Book> {
    // Validaciones
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new Error(ERROR_MESSAGES.BOOK_NOT_FOUND);
    if (book.ownerId === userId) throw new Error(ERROR_MESSAGES.CANNOT_BUY_OWN_BOOK);
    if (book.status === 'SOLD') throw new Error(ERROR_MESSAGES.BOOK_ALREADY_SOLD);

    // Actualizar libro
    const updatedBook = new Book({
      ...book,
      status: 'SOLD',
      soldAt: new Date(),
    });
    await this.bookRepository.update(updatedBook);

    // Enviar email al vendedor
    try {
      const seller = await this.userRepository.findById(book.ownerId);
      const buyer = await this.userRepository.findById(userId);

      if (seller) {
        await this.emailService.sendBookSoldNotification(seller.email, book.title, buyer?.email);
        console.log(`📧 Email enviado al vendedor: ${seller.email}`);
      }
    } catch (emailError) {
      console.error('⚠️ Error al enviar email (no crítico):', emailError);
    }

    return updatedBook;
  }
}
