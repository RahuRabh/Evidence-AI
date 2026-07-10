import { Router } from "express";
import multer from "multer";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { updateProfileHandler } from "../services/user/user.js"
import { updatePasswordHandler } from "../services/auth/auth.js";

export const userRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

userRouter.use(authMiddleware);

userRouter.put("/profile", upload.single("image"), updateProfileHandler);
userRouter.put("/update-Password", updatePasswordHandler);