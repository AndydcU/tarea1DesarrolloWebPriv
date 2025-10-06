import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/database/connect.js';
import mongoose from 'mongoose';
import Teacher from './src/models/Teacher.js';

// 🔹 Conexión a MongoDB
await connectDB();

// 🔹 Función para agregar los 5 catedráticos si no existen
async function seedTeachers() {
  const defaults = [
    { name: "Carlos Amilcar Tezo Palencia", course: "Desarrollo web" },
    { name: "Otto Rigoberto Ortiz Perez", course: "Analisis de Sistemas" },
    { name: "Dany Otoniel Oliva Belteton", course: "Programacion Avanzada" },
    { name: "Mario Roberto Mendez Romero", course: "Programacion Basica" },
    { name: "Oscar Alejandro Paz Campos", course: "Bases de datos" },
  ];

  for (const t of defaults) {
    await Teacher.updateOne(
      { name: t.name, course: t.course },
      { $setOnInsert: t },
      { upsert: true }
    );
  }

  console.log("✅ Catedráticos iniciales verificados/creados correctamente");
}

// 🔹 Ejecutar cuando Mongo esté listo
mongoose.connection.once('open', () => {
  seedTeachers().catch(console.error);
});

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
