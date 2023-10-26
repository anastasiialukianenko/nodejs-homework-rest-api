import express from 'express';
import authController from '../../controllers/auth.js';

import { authenticate, isEmptyBody, isValidUserId, upload } from "../../middlewares/index.js";


import {validateBody} from "../../decorators/index.js";
import { userRegisterSchema, userLoginSchema, userVerifySchema} from '../../models/user.js';

const userRegisterValidate = validateBody(userRegisterSchema);
const userLoginValidate = validateBody(userLoginSchema);
const userEmailValidate = validateBody(userVerifySchema);


const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, userRegisterValidate, authController.register);
authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", isEmptyBody, userEmailValidate, authController.resendVerifyEmail);

authRouter.post("/login", isEmptyBody, userLoginValidate, authController.login);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/:userId/subscription", isValidUserId, authenticate, isEmptyBody, authController.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);


export default authRouter; 

