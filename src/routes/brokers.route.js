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

router.get('/api/buybroker',mw(['broker']), BrokersController.buybroker);
router.get('/api/sellbroker',mw(['broker']), BrokersController.sellbroker);
router.get('/api/totalbroker',mw(['broker']), BrokersController.totalbroker);
router.get('/api/activebroker',mw(['broker']), BrokersController.activebroker);
router.get('/api/profitlossbroker',mw(['broker']), BrokersController.profitlossbroker);
router.get('/api/activebuybroker',mw(['broker']), BrokersController.activebuybroker);
router.get('/api/activesellbroker',mw(['broker']), BrokersController.activesellbroker);
router.get('/api/Brokerage',mw(['broker']), BrokersController.Brokerage);
router.get('/api/brokersId/:status',mw(['broker']), BrokersController.getbrokerageByStatus);

export default router;


