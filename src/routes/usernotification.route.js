import express from 'express';
// Controllers
import userNotificationController from '@/controllers/usernotification.controller';
// Utils
import { mw } from '@/utils/middleware.util';
// Constants
const router = express.Router();


router.post('/api/usernotification', mw(['admin']), userNotificationController.createnotification);
router.get('/api/userAllnotification', mw(['admin']), userNotificationController.getAllnotification);

export default router;