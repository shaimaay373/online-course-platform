import { Router } from "express";
import {login , registration} from '../controllers/auth.controller.js';
import{registerValidator,loginValidator} from '../validators/auth.validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();

router.post("/register", registerValidator, validate, registration);
router.post("/login", loginValidator, validate, login);


export default router;