import express, { Express, Response } from 'express';
import dotenv from 'dotenv';
import productosRouter from './routes/productos';
import categoriasRouter from './routes/categorias';
import marcasRouter from './routes/marcas_producto';
import ventaBateriasRouter from './routes/venta_baterias';
import authRouter from './routes/auth';
import cors from 'cors';
import rateLimit from 'express-rate-limit'; // middleware de express

// Configuración del rate limiting
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Límite de peticiones por IP
  standardHeaders: true, // Headers estándar (RateLimit-*)
  legacyHeaders: false, // Desactiva headers antiguos
  message: 'Demasiadas peticiones desde esta IP, por favor inténtalo de nuevo más tarde.'
});

//Configuracion del auth limiting
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Solo 10 intentos de login por hora
  message: 'Demasiados intentos de acceso, por favor inténtalo de nuevo más tarde.'
});


// inicializa dotenv para cargar las variables de entorno
dotenv.config();

const app: Express = express();

// Middleware de CORS ()
app.use(cors({
  origin: ['http://localhost:3000', 'https://taller-franco-frontend.vercel.app'], // Permite solo mi frontend en local y producción
  credentials: true // Si usas cookies o autenticación basada en sesión
}));


// Middleware to parse JSON bodies. This is crucial for POST/PUT requests.
app.use(express.json());

// Aplica rate limiting general a todas las rutas /api
app.use('/api', generalLimiter);

// Aplica rate limiting estricto solo al auth
app.use('/api/auth', authLimiter); 

// Routes
// Mount the routers under a common /api prefix for better organization
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/marcas_producto', marcasRouter);
app.use('/api/venta_baterias', ventaBateriasRouter);
app.use('/api/auth', authRouter);

// --- Bloque para iniciar el servidor en desarrollo local ---
const PORT = process.env.PORT || 3001; // Usa el puerto del entorno o 3001 por defecto

// Solo inicia el servidor si el archivo se ejecuta directamente en un entorno de no producción.
// Vercel no ejecutará este bloque, pero sí lo hará `ts-node-dev`.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor de desarrollo corriendo en http://localhost:${PORT}`);
  });
}


// Exportación para Vercel
module.exports = app;  // Usa `module.exports` para compatibilidad con @vercel/node