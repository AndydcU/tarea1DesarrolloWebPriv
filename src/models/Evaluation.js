import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  q1: { type: Number, min: 1, max: 5, required: true },
  q2: { type: Number, min: 1, max: 5, required: true },
  q3: { type: Number, min: 1, max: 5, required: true },
  q4: { type: Number, min: 1, max: 5, required: true },
  q5: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: [true, "El comentario es obligatorio"] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Evaluation", evaluationSchema);
