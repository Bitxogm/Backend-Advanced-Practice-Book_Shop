export interface EmailService {
  sendBookSoldNotification(
    sellerEmail: string,
    bookTitle: string,
    buyerEmail?: string
  ): Promise<void>;

  sendPriceReductionSuggestion(
    sellerEmail: string,
    bookTitle: string,
    daysPublished: number
  ): Promise<void>;
}
