// src/app.js
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use('/uploads', express.static('uploads'));

export default app;
