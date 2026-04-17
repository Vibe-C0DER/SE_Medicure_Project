import User from '../models/user.model.js';
import Disease from '../models/disease.model.js';
import Article from '../models/article.model.js';
import Report from '../models/report.model.js';
import Symptom from '../models/symptom.model.js';
import { errorHandler } from '../errors/error.js';

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalDiseases, totalSymptoms, totalArticles, totalReports, totalUsers] = await Promise.all([
      Disease.countDocuments({ isActive: true }),
      Symptom.countDocuments(),
      Article.countDocuments({ isActive: true }),
      Report.countDocuments(),
      User.countDocuments({ isActive: true }),
    ]);

    // Reports grouped by day for last 7 days
    const reportsLast7Days = await Report.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Articles grouped by day for last 7 days
    const articlesLast7DaysRaw = await Article.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, isActive: true } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Fill in 0s for missing days
    const reportsChartData = [];
    const articlesChartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const foundReport = reportsLast7Days.find(r => r._id === dateStr);
      const foundArticle = articlesLast7DaysRaw.find(a => a._id === dateStr);
      reportsChartData.push({ date: dateStr, count: foundReport ? foundReport.count : 0 });
      articlesChartData.push({ date: dateStr, count: foundArticle ? foundArticle.count : 0 });
    }

    res.status(200).json({
      success: true,
      data: {
        totalDiseases,
        totalSymptoms,
        totalArticles,
        totalReports,
        totalUsers,
        reportsLast7Days: reportsChartData,
        articlesLast7Days: articlesChartData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/dashboard/recent
export const getRecentActivity = async (req, res, next) => {
  try {
    const [recentDiseases, recentArticles, recentReports] = await Promise.all([
      Disease.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select('name severity createdAt'),
      Article.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select('title category createdAt'),
      Report.find().sort({ createdAt: -1 }).limit(5)
        .populate('user', 'firstName lastName email')
        .populate('topDisease', 'name')
        .select('user topDisease createdAt'),
    ]);

    res.status(200).json({
      success: true,
      data: { recentDiseases, recentArticles, recentReports },
    });
  } catch (error) {
    next(error);
  }
};
