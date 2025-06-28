import express, { Express, Response } from 'express';
import dotenv from 'dotenv';
import productosRouter from './routes/productos';
import categoriasRouter from './routes/categorias';
import marcasRouter from './routes/marcas_producto';
import ventaBateriasRouter from './routes/venta_baterias';
import authRouter from './routes/auth';
import cors from 'cors';


// Initialize dotenv to load environment variables from the .env file
dotenv.config();

const app: Express = express();

// Middleware de CORS ()
app.use(cors({
  origin: 'https://taller-franco-frontend.vercel.app', // Permite solo mi frontend
  credentials: true // Si usas cookies o autenticación basada en sesión
}));


// Middleware to parse JSON bodies. This is crucial for POST/PUT requests.
app.use(express.json());

// Routes
// Mount the routers under a common /api prefix for better organization
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/marcas_producto', marcasRouter);
app.use('/api/venta_baterias', ventaBateriasRouter);
app.use('/api/auth', authRouter);

// Exportación para Vercel
module.exports = app;  // Usa `module.exports` para compatibilidad con @vercel/node