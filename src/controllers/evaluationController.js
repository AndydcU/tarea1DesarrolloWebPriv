import Evaluation from "../models/Evaluation.js";
import Teacher from "../models/Teacher.js";

// Convierte texto (“Excelente”, “Bueno”, etc.) a número 5..1
const toScore = (v) => {
  if (typeof v === "number") return v;
  const map = { Excelente: 5, Bueno: 4, Regular: 3, Deficiente: 2, Malo: 1 };
  return map[v] ?? 3;
};

export const addEvaluation = async (req, res) => {
  try {
    const { teacherId, q1, q2, q3, q4, q5, comment, dominio, claridad, puntualidad, justa, cumplimiento } = req.body;

    if (!teacherId) return res.status(400).json({ message: "teacherId es requerido" });
    if (!comment || comment.trim() === "") return res.status(400).json({ message: "Comentario obligatorio" });

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Catedrático no encontrado" });

    const evaluation = await Evaluation.create({
      teacherId,
      q1: toScore(q1 ?? dominio),
      q2: toScore(q2 ?? claridad),
      q3: toScore(q3 ?? puntualidad),
      q4: toScore(q4 ?? justa),
      q5: toScore(q5 ?? cumplimiento),
      comment,
    });

    res.status(201).json(evaluation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const { teacherId } = req.query;
    if (!teacherId) return res.status(400).json({ message: "teacherId es requerido" });

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "No encontrado" });

    const evaluations = await Evaluation.find({ teacherId });
    const all = await Evaluation.find();

    const calcAvg = (evs) =>
      evs.length === 0
        ? 0
        : Number(
            (
              evs.reduce((sum, e) => sum + (e.q1 + e.q2 + e.q3 + e.q4 + e.q5) / 5, 0) /
              evs.length
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

export const getComments = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({}, "comment -_id");
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

