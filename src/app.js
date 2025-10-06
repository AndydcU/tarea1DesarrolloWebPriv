import express from "express";
import cors from "cors";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import Teacher from "./models/Teacher.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ruta principal
app.get("/", (req, res) => {
  res.send("✅ API Evaluación funcionando correctamente");
});

// ✅ Rutas principales
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/teachers", teacherRoutes);

// ✅ Catedráticos por defecto
const defaultTeachers = [
  { name: "Carlos Amilcar Tezo Palencia", course: "Desarrollo web" },
  { name: "Otto Rigoberto Ortiz Perez", course: "Analisis de Sistemas" },
  { name: "Dany Otoniel Oliva Belteton", course: "Programacion Avanzada" },
  { name: "Mario Roberto Mendez Romero", course: "Programacion Basica" },
  { name: "Oscar Alejandro Paz Campos", course: "Bases de datos" },
];

// ✅ Bloque que limpia e inserta los nuevos al iniciar
(async () => {
  try {
    console.log("🧹 Eliminando catedráticos antiguos...");
    await Teacher.deleteMany({});
    await Teacher.insertMany(defaultTeachers);
    console.log("✅ Catedráticos actualizados con éxito");
  } catch (err) {
    console.error("❌ Error actualizando catedráticos:", err.message);
  }
})();

export default app;
