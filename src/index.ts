import express, { Express, Response } from 'express';
import dotenv from 'dotenv';
import productosRouter from './routes/productos';


// Initialize dotenv to load environment variables from the .env file
dotenv.config();

const app: Express = express();

// Middleware to parse JSON bodies. This is crucial for POST/PUT requests.
app.use(express.json());

// Routes
// Mount the routers under a common /api prefix for better organization
app.use('/api/productos', productosRouter);

// Define the port, using the environment variable or defaulting to 3000
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});