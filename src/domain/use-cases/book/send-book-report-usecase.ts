//crear cron job , para enviar reporte a usuario cuando un libro pase de published a sold

import { IBookRepository } from '@domain/repositories/BookRepository';
import type { UserRepository } from '@domain/repositories/UserRepository';
import type { EmailService } from '@domain/services/EmailService';

export class SendBookReportUseCase {
  private readonly userRepository: UserRepository;
  private readonly bookRepository: IBookRepository;
  private readonly emailService: EmailService;

  constructor(
    userRepository: UserRepository,
    bookRepository: IBookRepository,
    emailService: EmailService
  ) {
    this.userRepository = userRepository;
    this.bookRepository = bookRepository;
    this.emailService = emailService;
  }

  public execute() {}
}
