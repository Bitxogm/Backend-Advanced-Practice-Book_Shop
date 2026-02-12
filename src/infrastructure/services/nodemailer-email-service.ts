// src/infrastructure/services/nodemailer-email-service.ts
import nodemailer from 'nodemailer';
import { env } from '../../config/environment';
import type { EmailService } from '../../domain/services/EmailService';

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
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                <h1>¡Buenas noticias! 🎉</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 20px; margin-top: 20px;">
                <p>Hola,</p>
                <p>Tu libro <strong>"${bookTitle}"</strong> ha sido vendido.</p>
                ${buyerEmail ? `<p>Comprador: ${buyerEmail}</p>` : ''}
                <p>¡Gracias por usar BookShop!</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `¡Tu libro "${bookTitle}" ha sido vendido!`,
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
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <div style="background-color: #FF9800; color: white; padding: 20px; text-align: center;">
                <h1>💡 Sugerencia para tu libro</h1>
              </div>
              <div style="background-color: #f9f9f9; padding: 20px; margin-top: 20px;">
                <p>Tu libro <strong>"${bookTitle}"</strong> lleva ${daysPublished} días publicado.</p>
                <p>💡 Consejo: Considera bajar el precio para aumentar las ventas.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Tu libro "${bookTitle}" lleva ${daysPublished} días publicado. Considera bajar el precio.`,
      });

      console.log('✅ Email de sugerencia enviado');

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🌐 Ver email en:', previewUrl);
      }
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
    }
  }
}
