'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const user_routes_1 = __importDefault(require('./user.routes'));
// import sessionRoutes from './session.routes';
const router = (0, express_1.Router)();
router.use('/users', user_routes_1.default);
// router.use('/sessions', sessionRoutes);
// Ajoute ici d'autres routeurs pour tes différentes ressources
exports.default = router;
