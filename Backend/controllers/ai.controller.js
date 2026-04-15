import { extractSymptomsFromText } from '../services/ai.service.js';
import Symptom from '../models/symptom.model.js';
import { rankDiseasesBySymptoms } from './prediction.controller.js';
import { errorHandler } from '../errors/error.js';

export const analyzeTextSymptoms = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return next(errorHandler(400, 'Text input is required'));
    }

    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(401, 'Unauthorized'));
    }

    // Call AI API to extract symptoms
    let extractedSymptoms = [];
    try {
       extractedSymptoms = await extractSymptomsFromText(text);
    } catch (aiError) {
       return next(errorHandler(503, aiError.message || 'AI service unavailable'));
    }

    if (!extractedSymptoms || extractedSymptoms.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No recognizable symptoms found',
        data: {
          extractedSymptoms: [],
          matchedSymptoms: [],
          diseases: []
        }
      });
    }

    // Match extracted symptoms with DB
    // Use regex to implement case-independent exact or partial matching
    const regexs = extractedSymptoms.map(s => new RegExp('^' + s + '$', 'i'));
    const matchedDocs = await Symptom.find({ name: { $in: regexs } });

    if (matchedDocs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No recognizable symptoms found',
        data: {
          extractedSymptoms: extractedSymptoms,
          matchedSymptoms: [],
          diseases: []
        }
      });
    }

    const symptomIds = matchedDocs.map(doc => String(doc._id));
    const matchedSymptomNames = matchedDocs.map(doc => doc.name);

    // Call EXISTING disease ranking function
    const { predictions, topDisease } = await rankDiseasesBySymptoms(userId, symptomIds);

    return res.status(200).json({
      success: true,
      message: 'Text analysis completed',
      data: {
        extractedSymptoms,
        matchedSymptoms: matchedSymptomNames,
        diseases: predictions,
        topDisease
      }
    });

  } catch (error) {
    if (error.statusCode) {
      return next(error);
    }
    console.error('analyzeTextSymptoms error:', error);
    next(errorHandler(500, 'Server error'));
  }
};
