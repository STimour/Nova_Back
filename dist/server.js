"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const node_cron_1 = __importDefault(require("node-cron"));
const helperBadge_service_1 = require("./services/helperBadge.service");
const reputationHistory_service_1 = require("./services/reputationHistory.service");
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;
const application = new app_1.default(port);
application.listen();
// Planification du cron pour mettre à jour les super helpers chaque semaine
const badgeService = new helperBadge_service_1.HelperBadgeService();
node_cron_1.default.schedule('0 0 * * 0', () => {
    // chaque dimanche à minuit
    badgeService.updateSuperHelpers();
});
const reputationHistoryService = new reputationHistory_service_1.ReputationHistoryService();
node_cron_1.default.schedule('0 1 * * 0', () => {
    // chaque dimanche à 1h du matin
    reputationHistoryService.saveWeeklyReputation();
});
