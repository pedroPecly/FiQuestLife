/**
 * ============================================
 * CLEANUP INVITATIONS JOB
 * ============================================
 * 
 * Job para limpar convites antigos do banco de dados
 * Executa diariamente para manter o banco limpo e performático
 * 
 * Estratégia:
 * 1. Convites rejeitados → Deletados imediatamente
 * 2. Convites aceitos + desafio completado > 7 dias → Deletar
 * 3. Convites pendentes > 7 dias → Deletar
 * 
 * @created 2 de dezembro de 2025
 */

import { cleanupCompletedInvitations, cleanupExpiredInvitations } from '../services/challenge-invitation.service.js';

/**
 * Executa limpeza de convites antigos
 * Deve ser agendado para rodar diariamente (ex: 3h da manhã)
 */
export const runInvitationsCleanup = async () => {
  console.log('[CLEANUP JOB] 🧹 Iniciando limpeza de convites...');
  
  try {
    const startTime = Date.now();

    // Limpar convites de desafios completados há mais de 7 dias
    const completedCount = await cleanupCompletedInvitations();
    
    // Limpar convites pendentes expirados (mais de 7 dias sem resposta)
    const expiredCount = await cleanupExpiredInvitations();

    const totalDeleted = completedCount + expiredCount;
    const duration = Date.now() - startTime;

    console.log(`[CLEANUP JOB] ✅ Limpeza concluída em ${duration}ms`);
    console.log(`[CLEANUP JOB] 📊 Total deletado: ${totalDeleted} registros`);
    console.log(`[CLEANUP JOB] 📈 Completados: ${completedCount} | Expirados: ${expiredCount}`);

    return { success: true, totalDeleted, completedCount, expiredCount, duration };
  } catch (error) {
    console.error('[CLEANUP JOB] ❌ Erro na limpeza:', error);
    throw error;
  }
};

/**
 * Configuração para agendar o job (exemplo com node-cron)
 * Descomente para usar com scheduler
 */
// import cron from 'node-cron';
// 
// export const scheduleInvitationsCleanup = () => {
//   // Executa todos os dias às 3h da manhã
//   cron.schedule('0 3 * * *', async () => {
//     console.log('[CLEANUP SCHEDULER] Iniciando job agendado...');
//     await runInvitationsCleanup();
//   });
//   
//   console.log('[CLEANUP SCHEDULER] ✅ Job agendado: todos os dias às 3h');
// };
