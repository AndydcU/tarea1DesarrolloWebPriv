import express from "express";
import {
  addEvaluation,
  getStats,
  getComments,
  analyzeComments
} from "../controllers/evaluationController.js";

const router = express.Router();

router.post("/", addEvaluation);
router.get("/stats", getStats);
router.get("/comments", getComments);
router.get("/analyze", analyzeComments);

export default router;
