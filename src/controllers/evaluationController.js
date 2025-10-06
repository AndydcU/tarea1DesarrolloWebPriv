import Evaluation from "../models/Evaluation.js";
import Teacher from "../models/Teacher.js";

// Conversión de texto a valor numérico
const convertirValor = (texto) => {
  const mapa = {
    Excelente: 5,
    Bueno: 4,
    Regular: 3,
    Malo: 2,
    Pésimo: 1,
  };
  return mapa[texto] || 3; // valor neutro si no coincide
};

export const addEvaluation = async (req, res) => {
  try {
    const {
      teacher, // nombre del catedrático
      dominio,
      claridad,
      puntualidad,
      justa,
      cumplimiento,
      comentario,
    } = req.body;

    // Validaciones básicas
    if (!teacher)
      return res.status(400).json({ message: "El campo 'teacher' es obligatorio" });
    if (!comentario || comentario.trim() === "")
      return res.status(400).json({ message: "El comentario es obligatorio" });

    // Buscar o crear al catedrático si no existe
    let teacherDoc = await Teacher.findOne({ name: teacher });
    if (!teacherDoc) {
      teacherDoc = await Teacher.create({
        name: teacher,
        course: "Sin especificar",
      });
    }

    // Crear la evaluación
    const nuevaEvaluacion = await Evaluation.create({
      teacherId: teacherDoc._id,
      q1: convertirValor(dominio),
      q2: convertirValor(claridad),
      q3: convertirValor(puntualidad),
      q4: convertirValor(justa),
      q5: convertirValor(cumplimiento),
      comment: comentario,
    });

    res.status(201).json({
      message: "Evaluación registrada con éxito",
      data: nuevaEvaluacion,
    });
  } catch (err) {
    console.error("Error al guardar evaluación:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const { teacherId } = req.query;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Catedrático no encontrado" });

    const evaluations = await Evaluation.find({ teacherId });
    const all = await Evaluation.find();

    const calcAvg = (evs) =>
      evs.length === 0
        ? 0
        : Number(
            (
              evs.reduce(
                (sum, e) => sum + (e.q1 + e.q2 + e.q3 + e.q4 + e.q5) / 5,
                0
              ) / evs.length
            ).toFixed(2)
          );

    res.json({
      teacher: { name: teacher.name, course: teacher.course },
      responses: evaluations.length,
      teacherAverage: calcAvg(evaluations),
      seminarAverage: calcAvg(all),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
