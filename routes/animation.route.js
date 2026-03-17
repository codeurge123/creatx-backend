import { Router } from "express";
import {
  createAnimation,
  getUserAnimations,
  getAnimationById,
  updateAnimation,
  deleteAnimation,
  getPublicAnimations,
  togglePublic,
  toggleLike,
} from "../controllers/animation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes (must come before /:id routes)
router.route("/public").get(getPublicAnimations);

// Secured routes
router.route("/").post(verifyJWT, createAnimation);
router.route("/user").get(verifyJWT, getUserAnimations);
router.route("/:id").get(verifyJWT, getAnimationById);
router.route("/:id").patch(verifyJWT, updateAnimation);
router.route("/:id").delete(verifyJWT, deleteAnimation);
router.route("/:id/toggle-public").patch(verifyJWT, togglePublic);
router.route("/:id/like").post(verifyJWT, toggleLike);

export default router;