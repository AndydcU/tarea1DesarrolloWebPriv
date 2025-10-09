import fetch from "node-fetch";
import Evaluation from "../models/Evaluation.js";
import Teacher from "../models/Teacher.js";

// ✅ Crear evaluación
export const createEvaluation = async (req, res) => {
  try {
    const { teacherId, q1, q2, q3, q4, q5, comment } = req.body;

    if (!teacherId || !q1 || !q2 || !q3 || !q4 || !q5) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const evaluation = new Evaluation({ teacherId, q1, q2, q3, q4, q5, comment });
    await evaluation.save();

    res.status(201).json({ message: "Evaluación registrada correctamente", evaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar la evaluación" });
  }
};

// ✅ Obtener estadísticas
export const getEvaluationStats = async (req, res) => {
  try {
    const { teacherId } = req.query;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ error: "Catedrático no encontrado" });

    const evaluations = await Evaluation.find({ teacherId });

    const responses = evaluations.length;
    const teacherAverage =
      responses === 0
        ? 0
        : (
            evaluations.reduce(
              (sum, e) => sum + e.q1 + e.q2 + e.q3 + e.q4 + e.q5,
              0
            ) /
            (responses * 5)
          ).toFixed(2);

    const all = await Evaluation.find();
    const seminarAverage =
      all.length === 0
        ? 0
        : (
            all.reduce(
              (sum, e) => sum + e.q1 + e.q2 + e.q3 + e.q4 + e.q5,
              0
            ) /
            (all.length * 5)
          ).toFixed(2);

    res.json({
      teacher,
      responses,
      teacherAverage,
      seminarAverage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

// ✅ Analizar sentimientos con Azure
export const analyzeSentiments = async (req, res) => {
  try {
    const comments = await Evaluation.find({}, "comment").lean();

    if (!comments.length) {
      return res.status(404).json({ message: "No hay comentarios para analizar." });
    }

    const endpoint = process.env.AZURE_ENDPOINT;
    const key = process.env.AZURE_KEY;

    const documents = comments
      .filter(c => c.comment && c.comment.trim() !== "")
      .map((c, i) => ({ id: String(i + 1), text: c.comment }));

    const response = await fetch(`${endpoint}/text/analytics/v3.1/sentiment?language=es`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ documents })
    });

    const data = await response.json();

    if (data.error || !data.documents) {
      console.error("Error Azure:", data);
      return res.status(500).json({ message: "Error en el análisis de Azure", data });
    }

    res.json({
      total: data.documents.length,
      results: data.documents.map((doc, i) => ({
        texto: comments[i].comment,
        sentimiento: doc.sentiment,
        positivo: (doc.confidenceScores?.positive * 100).toFixed(2) + "%",
        neutro: (doc.confidenceScores?.neutral * 100).toFixed(2) + "%",
        negativo: (doc.confidenceScores?.negative * 100).toFixed(2) + "%"
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno en el análisis", error: err.message });
  }
};
