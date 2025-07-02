import { HelperBadgeService } from '../services/helperBadge.service';
import { ReputationHistoryService } from '../services/reputationHistory.service';

async function runCronTasks() {
    console.log('🚀 Démarrage des tâches cron manuelles...');
    
    try {
        // Sauvegarde de la réputation hebdomadaire
        console.log('💾 Sauvegarde de la réputation hebdomadaire...');
        const reputationHistoryService = new ReputationHistoryService();
        await reputationHistoryService.saveWeeklyReputation();
        console.log('✅ Réputation hebdomadaire sauvegardée');
        
        // Mise à jour des super helpers
        console.log('📊 Mise à jour des super helpers...');
        const badgeService = new HelperBadgeService();
        await badgeService.updateSuperHelpers();
        console.log('✅ Super helpers mis à jour');

        console.log('🎉 Toutes les tâches cron ont été exécutées avec succès');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de l\'exécution des tâches cron:', error);
        process.exit(1);
    }
}

runCronTasks();