import express from 'express';
// Controllers
import BrokersController from '@/controllers/brokers.controller';
// Utils
import { mw } from '@/utils/middleware.util';
// Constants
const router = express.Router();

router.get('/api/brokers/all', mw(['admin']), BrokersController.getAll);
router.get('/api/brokers', mw(['user']), BrokersController.getAllLogged);
router.post('/api/brokers', mw(['admin']), BrokersController.createBroker);
router.put('/api/brokers/:id', mw(['admin']), BrokersController.updateBroker);

router.get('/api/brokers/all/:status', mw(['admin']), BrokersController.getAllByStatus);
router.get('/api/brokers/:status', mw(['user']), BrokersController.getTradeByStatus);
router.post('/api/brokers/login', BrokersController.login);

router.get('/api/buybroker/:id',mw(['broker']), BrokersController.buybroker);
router.get('/api/sellbroker/:id',mw(['broker']), BrokersController.sellbroker);
router.get('/api/totalbroker/:id',mw(['broker']), BrokersController.totalbroker);
router.get('/api/activebroker/:id',mw(['broker']), BrokersController.activebroker);
router.get('/api/profitlossbroker/:id',mw(['broker']), BrokersController.profitlossbroker);
router.get('/api/activebuybroker/:id',mw(['broker']), BrokersController.activebuybroker);
router.get('/api/activesellbroker/:id',mw(['broker']), BrokersController.activesellbroker);
router.get('/api/Brokerage/:id',mw(['broker']), BrokersController.Brokerage);
// router.get('/api/broker/:id/status/:status',mw(['broker']), BrokersController.getbrokerageByStatus);
router.get('/api/brokers/:id/:status',mw(['broker']), BrokersController.getbrokerageByStatus);

export default router;


