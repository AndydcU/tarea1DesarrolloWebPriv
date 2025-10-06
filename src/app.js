import express from "express";
import cors from "cors";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ API Evaluación funcionando");
});

app.use("/api/evaluations", evaluationRoutes);
app.use("/api/teachers", teacherRoutes);

export default app;
