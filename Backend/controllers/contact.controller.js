import Contact from '../models/contact.model.js';
import { errorHandler } from '../errors/error.js';

// Public: Create a new contact message
// POST /api/contact
export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return next(errorHandler(400, 'All fields are required.'));
    }

    if (message.length < 10) {
      return next(errorHandler(400, 'Message must be at least 10 characters long.'));
    }

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully.',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all messages
// GET /api/admin/contact
export const getAllContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Mark message as read
// PUT /api/admin/contact/:id/read
export const markMessageAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return next(errorHandler(404, 'Message not found.'));
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete a message
// DELETE /api/admin/contact/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return next(errorHandler(404, 'Message not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
