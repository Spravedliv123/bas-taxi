import { Router } from 'express';
import { initiatePayment, topUpBalance, getBalanceHistory } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateMiddleware } from '../middleware/validate.middleware.js';
import { initiatePaymentSchema } from '../validators/payment.validator.js';
import { validateInputMiddleware } from '../middleware/validateInput.middleware.js';

const router = Router();

router.post(
    '/payments/initiate', 
    authMiddleware, 
    validateMiddleware(initiatePaymentSchema), 
    validateInputMiddleware({
        "body": ["rideId", "amount"]
    }),
    initiatePayment
);

router.post(
    '/balance/top-up', 
    authMiddleware, 
    validateInputMiddleware({
        "body": ["amount"]
    }),
    topUpBalance
);

router.get(
    '/balance/history', 
    authMiddleware, 
    getBalanceHistory
);

export default router;