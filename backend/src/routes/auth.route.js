import { Router } from "express";
import {
  googleAuthHandler,
  loginHandler,
  registerHandler,
  logoutHandler,
  refreshHandler,
} from "../services/auth/auth.js";

export const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/register", registerHandler);
authRouter.post("/google", googleAuthHandler);
authRouter.post("/refresh", refreshHandler);
authRouter.post("/logout", logoutHandler);
