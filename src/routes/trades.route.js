import express from 'express';
// Controllers
import TradesController from '@/controllers/trades.controller';
// Utils
import { mw } from '@/utils/middleware.util';
// Constants
const router = express.Router();

router.get('/api/trades/all', mw(['admin']), TradesController.getAll);
router.get('/api/trades', mw(['user']), TradesController.getAllLogged);
router.post('/api/trades', mw(['user']), TradesController.createTrade);
router.put('/api/trades/:id', mw(['user']), TradesController.updateTrade);

router.get('/api/trades/all/:status', mw(['admin']), TradesController.getAllByStatus);
router.get('/api/trades/:status', mw(['user']), TradesController.getTradeByStatus);
router.get('/api/ledgers/all', mw(['admin']), TradesController.getAllLedgers);

router.get('/api/trades/allbuy_rate/buy', mw(['admin']), TradesController.getAllBuyRates);
router.get('/api/trades/allbuy_rate/sell', mw(['admin']), TradesController.getAllsellRates);
router.get('/api/trades/allternover/buy_sell', mw(['admin']), TradesController.getAllternover);
router.get('/api/Allactivetrade', mw(['admin']), TradesController.getactivetrade);
router.get('/api/trades/getAllProfitandloss/profit_loss', mw(['admin']), TradesController.getAllProfitandloss);
router.get('/api/trades/getAllactive_buy/buy', mw(['admin']), TradesController.getAllactive_buy);
router.get('/api/trades/getAllactive_sell/sell', mw(['admin']), TradesController.getAllactive_sell);
router.get('/api/trades/getallBrokerege/Brokerege', mw(['admin']), TradesController.Brokerege);
router.get('/api/ledgerbalance/:id', mw(['Broker']), TradesController.ledgerbalance);


router.get('/api/test', TradesController.testTrade);

export default router;
