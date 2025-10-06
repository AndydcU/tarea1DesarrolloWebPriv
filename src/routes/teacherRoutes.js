import express from "express";
import { getTeachers, addTeacher } from "../controllers/teacherController.js";
const router = express.Router();

router.get("/", getTeachers);
router.post("/", addTeacher);

export default router;
