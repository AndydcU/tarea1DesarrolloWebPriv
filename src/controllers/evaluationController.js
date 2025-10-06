import Evaluation from "../models/Evaluation.js";
import Teacher from "../models/Teacher.js";

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
