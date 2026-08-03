import express, { Application } from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Core Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
