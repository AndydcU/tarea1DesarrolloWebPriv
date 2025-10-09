import express from "express";
import { addEvaluation, getStats } from "../controllers/evaluationController.js";
import { getComments } from "../controllers/evaluationController.js";
const router = express.Router();

router.get("/comments", getComments);
router.post("/", addEvaluation);
router.get("/stats", getStats);

export default router;
