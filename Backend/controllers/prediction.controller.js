import mongoose from 'mongoose';
import Disease from '../models/disease.model.js';
import Symptom from '../models/symptom.model.js';
import Report from '../models/report.model.js';
import { errorHandler } from '../errors/error.js';

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const toDisplayName = (value) => {
  const s = String(value || '').trim();
  if (!s) return '';
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

export const analyzeSymptoms = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(401, 'Unauthorized'));
    }

    const raw = req.body?.symptoms;

   
    if (!Array.isArray(raw) || raw.length === 0) {
      return next(errorHandler(400, 'symptoms must be a non-empty array of symptom IDs'));
    }

    const symptomIds = [...new Set(raw.map((id) => String(id).trim()))].filter(Boolean);

    // console.log('symptomIds', symptomIds);
    for (const id of symptomIds) {
      if (!isValidObjectId(id)) {
        return next(errorHandler(400, `Invalid symptom id: ${id}`));
      }
    }

    const found = await Symptom.find({ _id: { $in: symptomIds } }).select('_id');

  
    if (found.length !== symptomIds.length) {
      return next(errorHandler(400, 'One or more symptom IDs do not exist'));
    }

    const userSet = new Set(symptomIds);
    const diseases = await Disease.find({ isActive: true }).lean();



    const ranked = [];

    for (const disease of diseases) {
      const diseaseSymptomIds = (disease.symptoms || []).map((s) =>
        String(s?._id || s)
      );
      
      const totalSymptoms = diseaseSymptomIds.length;
      if (totalSymptoms === 0) continue;

      const matchedSymptoms = diseaseSymptomIds.filter((id) => userSet.has(id)).length;
      if (matchedSymptoms === 0) continue;

      const matchPercentage = Math.round((matchedSymptoms / totalSymptoms) * 100);

      console.log('matchPercentage', matchPercentage);

      ranked.push({
        diseaseId: disease?._id,
        name: disease.name,
      specialist: disease.specialist,
        description: disease.description,
        severity: disease.severity,
        matchPercentage,
        matchedSymptoms,
        totalSymptoms,
      });
    }

    ranked.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return b.matchedSymptoms - a.matchedSymptoms;
    });

    const top5 = ranked.slice(0, 5);

    if (top5.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Disease prediction completed',
        data: {
          predictions: [],
          topDisease: null,
        },
      });
    }

    const predictionsPayload = top5.map((p) => ({
      disease: p.diseaseId,
      matchPercentage: p.matchPercentage,
      matchedSymptoms: p.matchedSymptoms,
      totalSymptoms: p.totalSymptoms,
    }));

    await Report.create({
      user: userId,
      symptoms: symptomIds,
      predictions: predictionsPayload,
      topDisease: top5[0].diseaseId,
    });

    const responsePredictions = top5.map((p) => ({
      diseaseName: toDisplayName(p.name),
      matchPercentage: p.matchPercentage,
      specialist: p.specialist,
      matchedSymptoms: p.matchedSymptoms,
      totalSymptoms: p.totalSymptoms,
      severity: p.severity,
      description: p.description,
    }));

    const topDisease = {
      name: toDisplayName(top5[0].name),
      specialist: top5[0].specialist,
    };

    return res.status(200).json({
      success: true,
      message: 'Disease prediction completed',
      data: {
        predictions: responsePredictions,
        topDisease,
      },
    });
  } catch (err) {
    next(err);
  }
};
