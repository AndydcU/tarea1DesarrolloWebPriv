import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/database/connect.js';

await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
