import express from 'express';
import { getExchangeRates } from '../controllers/currencyController.js';

const router = express.Router();

router.get('/rates', getExchangeRates);

export default router;
