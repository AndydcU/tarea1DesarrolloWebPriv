import express from "express";
import {
  createEvaluation,
  getEvaluationStats,
  analyzeSentiments,
} from "../controllers/evaluationController.js";

const router = express.Router();

router.post("/", createEvaluation);
router.get("/stats", getEvaluationStats);
router.get("/analyze", analyzeSentiments);

export default router;
