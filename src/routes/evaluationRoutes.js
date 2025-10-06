import express from "express";
import { addEvaluation, getStats } from "../controllers/evaluationController.js";
const router = express.Router();

router.post("/", addEvaluation);
router.get("/stats", getStats);

export default router;
