import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import appRouter from './Routes/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
//morgan for developing...
app.use(morgan("dev"));

app.use('/app/v1',appRouter);

export default app;