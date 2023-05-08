import express from 'express';
// Controllers
import userNotificationController from '@/controllers/usernotification.controller';
// Utils
import { mw } from '@/utils/middleware.util';
// Constants
const router = express.Router();


router.post('/api/usernotification', mw(['user']), userNotificationController.createnotification);
router.get('/api/userAllnotification', mw(['user']), userNotificationController.getAllnotification);
router.delete('/api/userfcmtokem', mw(['admin']), userNotificationController.deletuserfcmtokem);

export default router;