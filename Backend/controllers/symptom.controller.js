import mongoose from 'mongoose';
import Symptom, { SYMPTOM_CATEGORIES } from '../models/symptom.model.js';
import { errorHandler } from '../errors/error.js';

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

const sendOk = (res, message, data = undefined, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });



export const getAllSymptoms = async (req, res, next) => {
  try {
    
    const symptoms = await Symptom.find().sort({ category: 1, name: 1 });
    return sendOk(res, 'Symptoms fetched successfully', symptoms);
  } catch (err) {
    next(err);
  }
};

export const getSymptomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(errorHandler(400, 'Invalid symptom id'));
    }

    const symptom = await Symptom.findById(id);
    if (!symptom) {
      return next(errorHandler(404, 'Symptom not found'));
    }

    return sendOk(res, 'Symptom fetched successfully', symptom);
  } catch (err) {
    next(err);
  }
};

export const createSymptom = async (req, res, next) => {
  try {
    let { name, description, category } = req.body || {};

    if (!name || !description || !category) {
      return next(
        errorHandler(400, 'Name, description and category are required to create a symptom')
      );
    }

    name = String(name).trim().toLowerCase();
    description = String(description).trim();
    category = String(category).trim();

    if (!name) return next(errorHandler(400, 'Name cannot be empty'));
    if (!description) return next(errorHandler(400, 'Description cannot be empty'));
    if (!SYMPTOM_CATEGORIES.includes(category)) {
      return next(
        errorHandler(
          400,
          `Category must be one of: ${SYMPTOM_CATEGORIES.join(', ')}`
        )
      );
    }

    const existing = await Symptom.findOne({ name });
    if (existing) {
      return next(errorHandler(409, 'A symptom with this name already exists'));
    }

    const created = await Symptom.create({ name, description, category });
    return sendOk(res, 'Symptom created successfully', created, 201);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.name) {
      return next(errorHandler(409, 'A symptom with this name already exists'));
    }
    next(err);
  }
};

export const updateSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(errorHandler(400, 'Invalid symptom id'));
    }

    const updates = {};
    const payload = req.body || {};

    if (payload.name !== undefined) {
      const name = String(payload.name).trim().toLowerCase();
      if (!name) {
        return next(errorHandler(400, 'Name cannot be empty'));
      }
      updates.name = name;

      const dup = await Symptom.findOne({ name, _id: { $ne: id } });
      if (dup) {
        return next(errorHandler(409, 'A symptom with this name already exists'));
      }
    }

    if (payload.description !== undefined) {
      const description = String(payload.description).trim();
      if (!description) {
        return next(errorHandler(400, 'Description cannot be empty'));
      }
      updates.description = description;
    }

    if (payload.category !== undefined) {
      const category = String(payload.category).trim();
      if (!SYMPTOM_CATEGORIES.includes(category)) {
        return next(
          errorHandler(
            400,
            `Category must be one of: ${SYMPTOM_CATEGORIES.join(', ')}`
          )
        );
      }
      updates.category = category;
    }

    if (Object.keys(updates).length === 0) {
      return next(errorHandler(400, 'No valid fields provided to update'));
    }

    const updated = await Symptom.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(errorHandler(404, 'Symptom not found'));
    }

    return sendOk(res, 'Symptom updated successfully', updated);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.name) {
      return next(errorHandler(409, 'A symptom with this name already exists'));
    }
    next(err);
  }
};

export const deleteSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return next(errorHandler(400, 'Invalid symptom id'));
    }

    const deleted = await Symptom.findByIdAndDelete(id);
    if (!deleted) {
      return next(errorHandler(404, 'Symptom not found'));
    }

    return sendOk(res, 'Symptom deleted successfully', deleted);
  } catch (err) {
    next(err);
  }
};

