// src/infrastructure/services/nodemailer-email-service.ts
import nodemailer from 'nodemailer';
import { env } from '../../config/environment';
import type { EmailService } from '../../domain/services/EmailService';
import { emailTemplates } from './email-templates';

export class NodeMailerEmailService implements EmailService {
  private transporter;

  constructor() {
    console.log('🔧 Configurando NodeMailer...');
    console.log('   Host:', env.EMAIL_HOST);
    console.log('   Port:', env.EMAIL_PORT);
    console.log('   User:', env.EMAIL_USER);

    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    this.transporter.verify((error: Error | null, success: boolean) => {
      if (error) {
        console.error('❌ Error conectando a Ethereal SMTP:', error.message);
      } else if (success) {
        console.log('✅ Ethereal SMTP listo para enviar emails');
      }
    });
  }

  async sendBookSoldNotification(
    sellerEmail: string,
    bookTitle: string,
    buyerEmail?: string
  ): Promise<void> {
    try {
      console.log(`\n📧 Enviando email a: ${sellerEmail}`);

      const info = await this.transporter.sendMail({
        from: '"BookShop 📚" <noreply@bookshop.com>',
        to: sellerEmail,
        subject: '🎉 ¡Tu libro se ha vendido!',
        html: emailTemplates.bookSold(bookTitle, buyerEmail),
        text: `¡Tu libro "${bookTitle}" ha sido vendido!${buyerEmail ? ` Comprador: ${buyerEmail}` : ''}`,
      });

      console.log('✅ Email enviado correctamente');
      console.log('   Message ID:', info.messageId);

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🌐 Ver email en:', previewUrl);
        console.log('   (Copia este link en tu navegador)\n');
      }
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw error;
    }
  }

  async sendPriceReductionSuggestion(
    sellerEmail: string,
    bookTitle: string,
    daysPublished: number
  ): Promise<void> {
    try {
      console.log(`\n📧 Enviando sugerencia de precio a: ${sellerEmail}`);

      const info = await this.transporter.sendMail({
        from: '"BookShop 📚" <noreply@bookshop.com>',
        to: sellerEmail,
        subject: '💡 Sugerencia: ¿Considerar bajar el precio?',
        html: emailTemplates.priceReductionSuggestion(bookTitle, daysPublished),
        text: `Tu libro "${bookTitle}" lleva ${daysPublished} días publicado. Considera bajar el precio.`,
      });

      console.log('✅ Email de sugerencia enviado');

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🌐 Ver email en:', previewUrl);
      }
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw error;
    }
  }
}
