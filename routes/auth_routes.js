import { Router } from 'express';
import { registerHospital, loginHospital } from '../controllers/auth_controller.js'

export const authRouter = Router();

authRouter.post('/register', registerHospital);
authRouter.post('/login', loginHospital);