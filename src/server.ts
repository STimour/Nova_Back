import App from './app';
import cron from 'node-cron';
import { HelperBadgeService } from './services/helperBadge.service';
import { ReputationHistoryService } from './services/reputationHistory.service';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const application = new App(port);

application.listen();

// Planification du cron pour mettre à jour les super helpers chaque semaine
const badgeService = new HelperBadgeService();
cron.schedule('0 0 * * 0', () => { // chaque dimanche à minuit
    badgeService.updateSuperHelpers();
});

const reputationHistoryService = new ReputationHistoryService();
cron.schedule('0 1 * * 0', () => { // chaque dimanche à 1h du matin
    reputationHistoryService.saveWeeklyReputation();
});
