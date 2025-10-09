import Evaluation from "../models/Evaluation.js";
import Teacher from "../models/Teacher.js";
import fetch from "node-fetch";

// 📌 Crear una evaluación
export const addEvaluation = async (req, res) => {
  try {
    const { teacherId, q1, q2, q3, q4, q5, comment } = req.body;

    if (!comment || comment.trim() === "")
      return res.status(400).json({ message: "Comentario obligatorio" });

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Catedrático no encontrado" });

    const evaluation = await Evaluation.create({ teacherId, q1, q2, q3, q4, q5, comment });
    res.status(201).json(evaluation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Obtener estadísticas
export const getStats = async (req, res) => {
  const { teacherId } = req.query;
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return res.status(404).json({ message: "No encontrado" });

  const evaluations = await Evaluation.find({ teacherId });
  const all = await Evaluation.find();

  const calcAvg = (evs) =>
    evs.length === 0 ? 0 :
    Number((
      evs.reduce((sum, e) => sum + (e.q1 + e.q2 + e.q3 + e.q4 + e.q5) / 5, 0) / evs.length
    ).toFixed(2));

  res.json({
    teacher: { name: teacher.name, course: teacher.course },
    responses: evaluations.length,
    teacherAverage: calcAvg(evaluations),
    seminarAverage: calcAvg(all),
  });
};

// 🗒️ Obtener todos los comentarios
export const getComments = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({}, "comment -_id");
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🤖 Analizar sentimientos con Azure desde el backend
export const analyzeComments = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({}, "comment -_id");
    if (!evaluations.length) return res.status(404).json({ message: "No hay comentarios" });

    const comments = evaluations.map((e, i) => ({ id: i + 1, text: e.comment }));

    const endpoint = process.env.AZURE_ENDPOINT;
    const key = process.env.AZURE_KEY;

    const response = await fetch(`${endpoint}/text/analytics/v3.1/sentiment?language=es`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documents: comments }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
