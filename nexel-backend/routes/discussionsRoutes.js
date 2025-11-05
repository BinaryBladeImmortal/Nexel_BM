import express from 'express';
import { stream, sendMessage } from '../controllers/discussionsController.js';

const router = express.Router();

// Public stream for discussions (guests can read)
router.get('/stream', stream);

// Send message (allow guests, but include user name if available)
router.post('/send', express.json(), sendMessage);

export default router;


