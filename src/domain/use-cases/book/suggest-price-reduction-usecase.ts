import { IBookRepository } from '@domain/repositories/BookRepository';
import type { UserRepository } from '@domain/repositories/UserRepository';
import type { EmailService } from '@domain/services/EmailService';

export interface SuggestPriceReductionResult {
  processedBooks: number;
  emailsSent: number;
  emailsFailed: number;
}

export class SuggestPriceReductionUseCase {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  public async execute(daysOld: number = 7): Promise<SuggestPriceReductionResult> {
    const oldBooks = await this.bookRepository.findOldPublishedBooks(daysOld);

    if (oldBooks.length === 0) {
      return {
        processedBooks: 0,
        emailsSent: 0,
        emailsFailed: 0,
      };
    }

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const book of oldBooks) {
      try {
        const seller = await this.userRepository.findById(book.ownerId);

        if (!seller) {
          emailsFailed++;
          continue;
        }

        const bookCreatedAt = new Date(book.createdAt);
        const daysPublished = Math.floor(
          (Date.now() - bookCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        await this.emailService.sendPriceReductionSuggestion(
          seller.email,
          book.title,
          daysPublished
        );

        emailsSent++;
      } catch (error) {
        emailsFailed++;
      }
    }

    return {
      processedBooks: oldBooks.length,
      emailsSent,
      emailsFailed,
    };
  }
}
