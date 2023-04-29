import express from 'express';
// Controllers
import ScriptController from '@/controllers/script.controller';
// Utils
import { mw } from '@/utils/middleware.util';
// Constants
const router = express.Router();


router.post('/api/script', mw(['admin']), ScriptController.createscript);
router.get('/api/Allscript', ScriptController.getAllscript);
router.put('/api/updatescript/:id', mw(['admin']), ScriptController.updatescript);
router.delete('/api/deletscript/:id', mw(['admin']), ScriptController.deletscript);


export default router;