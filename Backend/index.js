import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import symptomRouter from './routes/symptom.route.js';
import diseaseRouter from './routes/disease.route.js';
import predictionRouter from './routes/prediction.routes.js';
import aiRouter from './routes/ai.routes.js';
import { userReportRouter } from './routes/report.route.js';
import articleRouter from './routes/article.routes.js';
import adminDiseaseRouter from './routes/admin/admin.disease.routes.js';
import adminSymptomRouter from './routes/admin/admin.symptom.routes.js';
import adminArticleRouter from './routes/admin/admin.article.routes.js';
import adminReportRouter from './routes/admin/admin.report.routes.js';
import adminDashboardRouter from './routes/admin/admin.dashboard.routes.js';
import adminUsersRouter from './routes/admin/admin.users.routes.js';
import contactRouter from './routes/contact.route.js';
import adminContactRouter from './routes/admin/admin.contact.routes.js';
import mapsRouter from './routes/maps.route.js';
import connectDB from './db/connectDB.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true ,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/symptoms', symptomRouter);
app.use('/api/diseases', diseaseRouter);
app.use('/api/predict', predictionRouter);
app.use('/api/ai', aiRouter);
app.use('/api/reports', userReportRouter);
app.use('/api/articles', articleRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin/diseases', adminDiseaseRouter);
app.use('/api/admin/symptoms', adminSymptomRouter);
app.use('/api/admin/articles', adminArticleRouter);
app.use('/api/admin/reports', adminReportRouter);
app.use('/api/admin/dashboard', adminDashboardRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/contact', adminContactRouter);
app.use('/api/maps', mapsRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

import startWeeklyDigestCron from './jobs/weeklyDigest.job.js';

const start = async () => {
  await connectDB();
  startWeeklyDigestCron();
  app.listen(PORT, () => {
    console.log(`Auth server is running on port ${PORT}!`);
  });
};
start();
