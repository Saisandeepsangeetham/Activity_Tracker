import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import appRouter from './Routes/index.js';

dotenv.config();
const app = express();

app.use(express.json());

//morgan for developing...
app.use(morgan("dev"));

app.use('/app/v1',appRouter);

export default app;