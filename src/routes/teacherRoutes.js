import express from "express";
import Teacher from "../models/Teacher.js";

const router = express.Router();

// GET /api/teachers  -> lista completa
router.get("/", async (_req, res) => {
  const teachers = await Teacher.find().sort({ name: 1 });
  res.json(teachers);
});

export default router;
