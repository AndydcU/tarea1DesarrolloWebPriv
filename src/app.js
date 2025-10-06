import express from "express";
import cors from "cors";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import Teacher from "./models/Teacher.js";

const app = express();
app.use(cors());
app.use(express.json());

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("✅ API Evaluación funcionando correctamente");
});

// Rutas principales
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/teachers", teacherRoutes);

// Catedráticos por defecto (solo se insertan si no hay ninguno)
const defaultTeachers = [
  { name: "Carlos Amilcar Tezo Palencia", course: "Desarrollo web" },
  { name: "Otto Rigoberto Ortiz Perez", course: "Analisis de Sistemas" },
  { name: "Dany Otoniel Oliva Belteton", course: "Programacion Avanzada" },
  { name: "Mario Roberto Mendez Romero", course: "Programacion Basica" },
  { name: "Oscar Alejandro Paz Campos", course: "Bases de datos" },
];

(async () => {
  try {
    const existing = await Teacher.countDocuments();
    if (existing === 0) {
      await Teacher.insertMany(defaultTeachers);
      console.log("✅ Catedráticos iniciales agregados automáticamente");
    } else {
      console.log("ℹ️ Catedráticos ya existentes, no se insertan duplicados");
    }
  } catch (err) {
    console.error("❌ Error insertando catedráticos por defecto:", err.message);
  }
})();

export default app;
