import express from 'express';
import authController from '../../controllers/auth.js';

import { authenticate, isEmptyBody, isValidUserId } from "../../middlewares/index.js";


import {validateBody} from "../../decorators/index.js";
import { userRegisterSchema, userLoginSchema} from '../../models/user.js';

const userRegisterValidate = validateBody(userRegisterSchema);
const userLoginValidate = validateBody(userLoginSchema);


const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, userRegisterValidate, authController.register);

authRouter.post("/login", isEmptyBody, userLoginValidate, authController.login);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/:userId/subscription", isValidUserId, authenticate, isEmptyBody, authController.updateSubscription);

export default authRouter; 

