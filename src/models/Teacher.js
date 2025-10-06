import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true }
});

export default mongoose.model("Teacher", teacherSchema);
