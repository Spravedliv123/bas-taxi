import express from 'express';
import { sendSmsManually, sendVerificationCodeManually } from '../controllers/sms.controller.js';
import { validateInputMiddleware } from '../middlewares/validateInput.middleware.js';

const router = express.Router();

router.post(
    '/send-sms', 
    validateInputMiddleware({
        "body": ["phones", "mes"]
    }),
    sendSmsManually
);

router.post(
    '/send-verification-code', 
    validateInputMiddleware({
        "body": ["phoneNumber", "verificationCode", "name"]
    }),
    sendVerificationCodeManually
);

export default router;
