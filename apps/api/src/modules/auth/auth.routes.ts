import { Router, type Router as ExpressRouter } from "express";
import { requireAuth } from "../../middleware/require-auth";
import { authController } from "./auth.controller";

export const authRouter: ExpressRouter = Router();

authRouter.post("/register", (req, res, next) => {
  void authController.register(req, res, next);
});

authRouter.post("/login", (req, res, next) => {
  void authController.login(req, res, next);
});

authRouter.post("/refresh", (req, res, next) => {
  void authController.refresh(req, res, next);
});

authRouter.post("/logout", (req, res, next) => {
  void authController.logout(req, res, next);
});

authRouter.get("/me", requireAuth, (req, res, next) => {
  void authController.me(req, res, next);
});
