/**
 * Email Templates
 * Templates simples y limpios para emails
 */

const baseStyles = `
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const headerStyle = `
  background-color: white;
  color: #333;
  padding: 20px;
  text-align: center;
  border-bottom: 4px solid;
`;

const contentStyle = `
  background-color: #f9f9f9;
  padding: 20px;
  margin-top: 0;
`;

const footerStyle = `
  background-color: #f0f0f0;
  padding: 15px;
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 20px;
`;

export const emailTemplates = {
  /**
   * Email: Libro vendido
   */
  bookSold: (bookTitle: string, buyerEmail?: string): string => {
    return `
      <!DOCTYPE html>
      <html>
      <body style="${baseStyles}">
        <div style="${headerStyle} border-bottom-color: #4CAF50;">
          <h2>¡Tu libro se ha vendido! 🎉</h2>
        </div>
        
        <div style="${contentStyle}">
          <p>Hola,</p>
          <p>Tu libro <strong>"${bookTitle}"</strong> ha sido vendido.</p>
          ${buyerEmail ? `<p><strong>Comprador:</strong> ${buyerEmail}</p>` : ''}
          <p>¡Gracias por usar BookShop!</p>
        </div>
        
        <div style="${footerStyle}">
          <p>© 2026 BookShop. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * Email: Sugerencia de reducción de precio
   */
  priceReductionSuggestion: (bookTitle: string, daysPublished: number): string => {
    return `
      <!DOCTYPE html>
      <html>
      <body style="${baseStyles}">
        <div style="${headerStyle} border-bottom-color: #FF9800;">
          <h2>💡 Sugerencia para tu libro</h2>
        </div>
        
        <div style="${contentStyle}">
          <p>Hola,</p>
          <p>Tu libro <strong>"${bookTitle}"</strong> lleva <strong>${daysPublished} días</strong> publicado.</p>
          <p style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #FF9800;">
            💡 <strong>Consejo:</strong> Considera bajar el precio para aumentar las ventas.
          </p>
          <p>¡Queremos ayudarte a vender más!</p>
        </div>
        
        <div style="${footerStyle}">
          <p>© 2026 BookShop. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `;
  },
};
