import Report from '../models/report.model.js';
import { errorHandler } from '../errors/error.js';
import PDFDocument from 'pdfkit';

// @desc    Get all reports of logged-in user
// @route   GET /api/reports/me
// @access  Private
export const getUserReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('symptoms', 'name')
      .populate('predictions.disease', 'name')
      .populate('topDisease', 'name');

    res.status(200).json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific report by id
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('symptoms', 'name category') // model might not have category, but it's safe to ask mongoose to populate
      .populate('topDisease', 'name specialist severity')
      .populate('predictions.disease', 'name specialist severity');

    if (!report) {
      return next(errorHandler(404, 'Report not found'));
    }

    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(errorHandler(403, 'Unauthorized to view this report'));
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (Admin)
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getAllReportsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.email) {
      // Find user(s) by email and then find their reports
      // Since we can't reliably populate and filter root in one go easily without aggregation,
      // let's do a simple aggregation or two steps.
      // Easiest is to just do two steps if email is provided, but since prompt says "Optional: filter by user email",
      // we can use a mongoose populate match or a user lookup.
      // For simplicity, we just use populate match and filter later or look up user id first.
      const User = (await import('../models/user.model.js')).default;
      const users = await User.find({ email: { $regex: req.query.email, $options: 'i' } }).select('_id');
      const userIds = users.map(u => u._id);
      query.user = { $in: userIds };
    }

    const reports = await Report.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('user', 'email firstName lastName')
      .populate('predictions.disease', 'name')
      .populate('topDisease', 'name');

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reports.length,
      page,
      totalPages: Math.ceil(total / limit),
      totalReports: total,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download Report PDF
// @route   GET /api/reports/:id/pdf
// @access  Private
export const downloadReportPDF = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'firstName lastName email gender age')
      .populate('symptoms', 'name')
      .populate('predictions.disease', 'name severity treatments')
      .populate('topDisease', 'name');

    if (!report) {
      return next(errorHandler(404, 'Report not found'));
    }

    if (report.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(errorHandler(403, 'Unauthorized to download this report'));
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.pdf`);

    doc.pipe(res);

    // Title
    doc.fontSize(20).text('MediCure Medical Report', { align: 'center' });
    doc.moveDown();

    // User Info
    if (report.user) {
      doc.fontSize(14).text('Patient Information', { underline: true });
      doc.fontSize(12).text(`Name: ${report.user.firstName} ${report.user.lastName}`);
      doc.fontSize(12).text(`Age: ${report.user.age}  |  Gender: ${report.user.gender}`);
      doc.fontSize(12).text(`Email: ${report.user.email}`);
      doc.moveDown();
    }

    // Report Date
    doc.fontSize(12).text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    // Symptoms
    doc.fontSize(14).text('Selected Symptoms', { underline: true });
    const symptomNames = report.symptoms.map(s => s.name).join(', ');
    doc.fontSize(12).text(symptomNames || 'None selected');
    doc.moveDown();

    // Top Disease
    doc.fontSize(14).text('Primary Finding', { underline: true });
    doc.fontSize(12).text(`Top Matched Disease: ${report.topDisease?.name || 'N/A'}`);
    doc.moveDown();

    // Predictions
    doc.fontSize(14).text('Detailed Analysis', { underline: true });
    report.predictions.forEach((pred, index) => {
      doc.fontSize(12).text(`${index + 1}. ${pred.disease?.name || 'Unknown'} - Match: ${pred.matchPercentage.toFixed(2)}%`);
      // Optional specialist logic, not in schema but prompt mentions Suggest specialist
      doc.fontSize(10).text(`   Suggested Action/Treatments: ${pred.disease?.treatments?.join(', ') || 'Consult a specialist'}`);
      doc.moveDown(0.5);
    });

    doc.end();

  } catch (error) {
    next(error);
  }
};
