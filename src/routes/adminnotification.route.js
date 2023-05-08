import express from 'express';
// Controllers
import adminNotificationController from '@/controllers/adminnotification.controller';
// Utils
import { mw } from '@/utils/middleware.util';
// Constants
const router = express.Router();


router.post('/api/adminnotification', mw(['admin']), adminNotificationController.createnotification);
router.get('/api/adminAllnotification', mw(['admin']), adminNotificationController.getAllnotification);
router.delete('/api/deletadminfcmtoken', mw(['admin']), adminNotificationController.deletadminfcmtokem);

export default router;