import express from 'express';
// Controllers
import NotificationController from '@/controllers/notification.controller';
// Utils
import { mw } from '@/utils/middleware.util';
// Constants
const router = express.Router();


router.post('/api/notification', mw(['admin']), NotificationController.createnotification);
router.get('/api/Allnotification', mw(['admin']), NotificationController.getAllnotification);
router.delete('/api/deletnotification', mw(['admin']), NotificationController.deletnotification);

export default router;