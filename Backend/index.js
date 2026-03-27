import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import symptomRouter from './routes/symptom.route.js';
import diseaseRouter from './routes/disease.route.js';
import connectDB from './db/connectDB.js';
import User from './models/user.model.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import Symptom from './models/symptom.model.js';
import Disease from './models/disease.model.js';


dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5174',
    credentials: true ,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/symptoms', symptomRouter);
app.use('/api/diseases', diseaseRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});



// Start server only after DB is connected
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Auth server is running on port ${PORT}!`);
  });
};
start();

(async () => {
  try {
    

    // Fetch symptoms from DB
    const symptoms = await Symptom.find();

    // Helper function to find symptom ID by name
    const getSymptom = (name) => {
      const s = symptoms.find((sym) => sym.name === name.toLowerCase());
      return s ? s._id : null;
    };

    const diseases = [
      {
        name: "Common Cold",
        description: "A viral infection affecting the upper respiratory tract.",
        symptoms: [
          getSymptom("cough"),
          getSymptom("fever"),
          getSymptom("sore throat"),
          getSymptom("runny nose"),
        ],
        precautions: ["Rest well", "Drink warm fluids", "Avoid cold food"],
        treatments: ["Paracetamol", "Steam inhalation"],
        severity: "Low",
      },
      {
        name: "Flu",
        description: "A contagious respiratory illness caused by influenza virus.",
        symptoms: [
          getSymptom("fever"),
          getSymptom("body pain"),
          getSymptom("headache"),
          getSymptom("fatigue"),
        ],
        precautions: ["Stay hydrated", "Rest", "Avoid crowded places"],
        treatments: ["Paracetamol", "Antiviral medicines"],
        severity: "Moderate",
      },
      {
        name: "Dengue",
        description: "Mosquito-borne viral infection common in tropical areas.",
        symptoms: [
          getSymptom("high fever"),
          getSymptom("joint pain"),
          getSymptom("headache"),
          getSymptom("nausea"),
        ],
        precautions: ["Avoid mosquito bites", "Use mosquito nets"],
        treatments: ["Fluids", "Medical monitoring"],
        severity: "High",
      },
      {
        name: "Migraine",
        description: "Severe headache often accompanied by nausea and light sensitivity.",
        symptoms: [
          getSymptom("headache"),
          getSymptom("nausea"),
          getSymptom("vomiting"),
        ],
        precautions: ["Avoid stress", "Sleep properly"],
        treatments: ["Pain relievers", "Rest in dark room"],
        severity: "Moderate",
      },
      {
        name: "Asthma",
        description: "A condition in which airways narrow and swell.",
        symptoms: [
          getSymptom("shortness of breath"),
          getSymptom("cough"),
          getSymptom("chest pain"),
        ],
        precautions: ["Avoid dust", "Avoid smoke"],
        treatments: ["Inhaler", "Bronchodilator"],
        severity: "High",
      },
      {
        name: "Food Poisoning",
        description: "Illness caused by eating contaminated food.",
        symptoms: [
          getSymptom("vomiting"),
          getSymptom("diarrhea"),
          getSymptom("stomach pain"),
        ],
        precautions: ["Eat fresh food", "Drink clean water"],
        treatments: ["ORS", "Hydration"],
        severity: "Moderate",
      },
      {
        name: "Skin Allergy",
        description: "Skin reaction due to allergens.",
        symptoms: [
          getSymptom("skin rash"),
          getSymptom("itching"),
          getSymptom("redness"),
        ],
        precautions: ["Avoid allergens"],
        treatments: ["Antihistamines"],
        severity: "Low",
      },
      {
        name: "Hypertension",
        description: "High blood pressure condition.",
        symptoms: [
          getSymptom("headache"),
          getSymptom("fatigue"),
          getSymptom("dizziness"),
        ],
        precautions: ["Reduce salt", "Exercise"],
        treatments: ["BP medication"],
        severity: "High",
      },
      {
        name: "COVID-19",
        description: "Viral respiratory disease.",
        symptoms: [
          getSymptom("fever"),
          getSymptom("cough"),
          getSymptom("loss of taste"),
        ],
        precautions: ["Wear mask", "Wash hands"],
        treatments: ["Isolation", "Medication"],
        severity: "High",
      },
      {
        name: "Typhoid",
        description: "Bacterial infection caused by contaminated food or water.",
        symptoms: [
          getSymptom("fever"),
          getSymptom("headache"),
          getSymptom("stomach pain"),
        ],
        precautions: ["Drink clean water"],
        treatments: ["Antibiotics"],
        severity: "High",
      },
    ];

    await Disease.insertMany(diseases);

    console.log("Diseases inserted successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
