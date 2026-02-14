/**
 * CRON JOB: Sugerencia de reducción de precio
 *
 * Se ejecuta automáticamente todos los lunes a las 9:00 AM
 * Busca libros con más de 7 días publicados y envía email al vendedor
 */

import cron from 'node-cron';
import { SuggestPriceReductionUseCase } from '../../domain/use-cases/book/suggest-price-reduction-usecase';
import { BookMongodbRepository } from '../repositories/book/book-mongodb-repository';
import { UserMongoRepository } from '../repositories/user/user-mongodb-repository';
import { NodeMailerEmailService } from '../services/nodemailer-email-service';

/**
 * Factory: Crea las instancias necesarias para la tarea
 * Agrupa la creación de dependencias en un único lugar
 */
function createSuggestPriceReductionUseCase(): SuggestPriceReductionUseCase {
  const bookRepository = new BookMongodbRepository();
  const userRepository = new UserMongoRepository();
  const emailService = new NodeMailerEmailService();

  return new SuggestPriceReductionUseCase(bookRepository, userRepository, emailService);
}

export const startPriceReductionCron = (): void => {
  console.log('🕐 Configurando cron job de sugerencia de precios...');

  // Expresión cron: Lunes a las 9:00 AM
  // Formato: 'minuto hora día_mes mes día_semana'
  // '0 9 * * 1' = minuto 0, hora 9, cualquier día del mes, cualquier mes, día 1 (lunes)
  const WEEKLY_MONDAY_9AM = '0 9 * * 1';

  cron.schedule(WEEKLY_MONDAY_9AM, async () => {
    console.log('\n⏰ ========================================');
    console.log('⏰ CRON JOB EJECUTADO - Sugerencia de precios');
    console.log('⏰ Fecha:', new Date().toLocaleString('es-ES'));
    console.log('⏰ ========================================\n');

    try {
      const DAYS_OLD = 7;

      console.log(`🕐 Ejecutando tarea semanal: Sugerencia de precios...`);
      console.log(`📅 Buscando libros publicados hace más de ${DAYS_OLD} días\n`);

      // Crear el use case y ejecutar
      const suggestPriceReductionUseCase = createSuggestPriceReductionUseCase();
      const result = await suggestPriceReductionUseCase.execute(DAYS_OLD);

      // Mostrar resultados
      if (result.processedBooks === 0) {
        console.log('✅ No hay libros que cumplan el criterio\n');
      } else {
        console.log(`📚 Libros encontrados: ${result.processedBooks}`);
        console.log('\n📊 Resumen:');
        console.log(`   Libros procesados: ${result.processedBooks}`);
        console.log(`   Emails enviados: ${result.emailsSent}`);
        console.log(`   Emails fallidos: ${result.emailsFailed}`);
        console.log('✅ Tarea semanal completada\n');
      }

      console.log('⏰ ========================================');
      console.log('⏰ CRON JOB COMPLETADO');
      console.log('⏰ ========================================\n');
    } catch (error) {
      console.error('\n❌ ========================================');
      console.error('❌ ERROR EN CRON JOB');
      console.error('❌ ========================================');
      console.error(error);
      console.error('❌ ========================================\n');
    }
  });

  console.log('✅ Cron job configurado: Sugerencia de precios semanal');
  console.log('   📅 Programado: Todos los lunes a las 9:00 AM');
  console.log('   🔍 Acción: Buscar libros con más de 7 días y enviar email');
};
