import Teacher from "../models/Teacher.js";

export const getTeachers = async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
};

export const addTeacher = async (req, res) => {
  const { name, course } = req.body;
  const teacher = new Teacher({ name, course });
  await teacher.save();
  res.status(201).json(teacher);
};
