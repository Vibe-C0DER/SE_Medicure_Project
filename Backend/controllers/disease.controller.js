import mongoose from 'mongoose';
import Disease, { DISEASE_SEVERITIES } from '../models/disease.model.js';
import Symptom from '../models/symptom.model.js';
import { errorHandler } from '../errors/error.js';

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const sendOk = (res, message, data = undefined, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });

const toDisplayName = (value) => {
  const name = String(value || '').trim();
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatDiseaseWithDisplaySymptoms = (doc) => {
  if (!doc) return doc;
  const obj = doc.toObject({ virtuals: true });

  if (Array.isArray(obj.symptoms)) {
    obj.symptoms = obj.symptoms.map((s) => ({
      _id: s._id,
      name: s.name,
      displayName: toDisplayName(s.name),
      category: s.category,
    }));
  }

  return obj;
};

const validateAndNormalizeSymptoms = async (symptoms) => {
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    throw errorHandler(400, 'At least one symptom is required');
  }

  const ids = [...new Set(symptoms.map((id) => String(id)))];

  for (const id of ids) {
    if (!isValidObjectId(id)) {
      throw errorHandler(400, `Invalid symptom id: ${id}`);
    }
  }

  const existing = await Symptom.find({ _id: { $in: ids } }).select('_id');
  if (existing.length !== ids.length) {
    throw errorHandler(400, 'One or more symptoms do not exist');
  }

  return ids;
};

const validateSeverityIfPresent = (severity) => {
  if (severity === undefined) return;
  const value = String(severity).trim();
  if (!DISEASE_SEVERITIES.includes(value)) {
    throw errorHandler(
      400,
      `Severity must be one of: ${DISEASE_SEVERITIES.join(', ')}`
    );
  }
  return value;
};

export const createDisease = async (req, res, next) => {
  try {
    let {
      name,
      description,
      symptoms,
      precautions = [],
      treatments = [],
      severity,
    } = req.body || {};

    if (!name || !description || !symptoms) {
      return next(
        errorHandler(
          400,
          'Name, description and symptoms are required to create a disease'
        )
      );
    }

    name = String(name).trim().toLowerCase();
    description = String(description).trim();

    if (!name) return next(errorHandler(400, 'Name cannot be empty'));
    if (!description) {
      return next(errorHandler(400, 'Description cannot be empty'));
    }

    if (!Array.isArray(precautions)) precautions = [];
    if (!Array.isArray(treatments)) treatments = [];

    try {
      severity = validateSeverityIfPresent(severity);
    } catch (err) {
      return next(err);
    }

    // Prevent duplicate diseases by name
    const existing = await Disease.findOne({ name });
    if (existing) {
      return next(errorHandler(409, 'A disease with this name already exists'));
    }

    let normalizedSymptomIds;
    try {
      normalizedSymptomIds = await validateAndNormalizeSymptoms(symptoms);
    } catch (err) {
      return next(err);
    }

    const created = await Disease.create({
      name,
      description,
      symptoms: normalizedSymptomIds,
      precautions,
      treatments,
      severity,
    });

    const populated = await created.populate({
      path: 'symptoms',
      select: 'name category',
    });

    return sendOk(
      res,
      'Disease created successfully',
      formatDiseaseWithDisplaySymptoms(populated),
      201
    );
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.name) {
      return next(errorHandler(409, 'A disease with this name already exists'));
    }
    return next(err);
  }
};

export const getAllDiseases = async (req, res, next) => {
  try {
    const diseases = await Disease.find({ isActive: true })
      .sort({ name: 1 })
      .populate({ path: 'symptoms', select: 'name category' });

    const formatted = diseases.map(formatDiseaseWithDisplaySymptoms);
    return sendOk(res, 'Diseases fetched successfully', formatted);
  } catch (err) {
    next(err);
  }
};

export const getDiseaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(errorHandler(400, 'Invalid disease id'));
    }

    const disease = await Disease.findOne({ _id: id, isActive: true }).populate(
      { path: 'symptoms', select: 'name category' }
    );

    if (!disease) {
      return next(errorHandler(404, 'Disease not found'));
    }

    return sendOk(
      res,
      'Disease fetched successfully',
      formatDiseaseWithDisplaySymptoms(disease)
    );
  } catch (err) {
    next(err);
  }
};

export const updateDisease = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(errorHandler(400, 'Invalid disease id'));
    }

    const payload = req.body || {};
    const updates = {};

    if (payload.name !== undefined) {
      const name = String(payload.name).trim().toLowerCase();
      if (!name) {
        return next(errorHandler(400, 'Name cannot be empty'));
      }

      const dup = await Disease.findOne({ name, _id: { $ne: id } });
      if (dup) {
        return next(
          errorHandler(409, 'A disease with this name already exists')
        );
      }
      updates.name = name;
    }

    if (payload.description !== undefined) {
      const description = String(payload.description).trim();
      if (!description) {
        return next(errorHandler(400, 'Description cannot be empty'));
      }
      updates.description = description;
    }

    if (payload.severity !== undefined) {
      try {
        updates.severity = validateSeverityIfPresent(payload.severity);
      } catch (err) {
        return next(err);
      }
    }

    if (payload.symptoms !== undefined) {
      try {
        updates.symptoms = await validateAndNormalizeSymptoms(payload.symptoms);
      } catch (err) {
        return next(err);
      }
    }

    if (payload.precautions !== undefined) {
      if (!Array.isArray(payload.precautions)) {
        return next(errorHandler(400, 'Precautions must be an array of strings'));
      }
      updates.precautions = payload.precautions.map((p) =>
        String(p || '').trim()
      );
    }

    if (payload.treatments !== undefined) {
      if (!Array.isArray(payload.treatments)) {
        return next(errorHandler(400, 'Treatments must be an array of strings'));
      }
      updates.treatments = payload.treatments.map((t) =>
        String(t || '').trim()
      );
    }

    if (Object.keys(updates).length === 0) {
      return next(errorHandler(400, 'No valid fields provided to update'));
    }

    const updated = await Disease.findOneAndUpdate(
      { _id: id, isActive: true },
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate({ path: 'symptoms', select: 'name category' });

    if (!updated) {
      return next(errorHandler(404, 'Disease not found'));
    }

    return sendOk(
      res,
      'Disease updated successfully',
      formatDiseaseWithDisplaySymptoms(updated)
    );
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.name) {
      return next(errorHandler(409, 'A disease with this name already exists'));
    }
    next(err);
  }
};

export const deleteDisease = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(errorHandler(400, 'Invalid disease id'));
    }

    const deleted = await Disease.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return next(errorHandler(404, 'Disease not found'));
    }

    return sendOk(res, 'Disease deleted successfully', deleted);
  } catch (err) {
    next(err);
  }
};

