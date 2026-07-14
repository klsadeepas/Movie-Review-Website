import Report from '../models/Report.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

export const createReport = async (req, res, next) => {
  try {
    const { review, reason } = req.body;
    const existingReview = await Review.findById(review);
    if (!existingReview) return res.status(404).json({ success: false, message: 'Review not found' });

    const existingReport = await Report.findOne({ review, user: req.user._id });
    if (existingReport) return res.status(400).json({ success: false, message: 'You already reported this review' });

    const report = await Report.create({ review, user: req.user._id, reason });
    existingReview.reports.push(req.user._id);
    await existingReview.save();

    await Notification.create({
      user: existingReview.user,
      message: `Your review was reported for: ${reason}`,
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (_req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('review', 'title movie user')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    await Review.findByIdAndUpdate(report.review, { $pull: { reports: report.user } });
    await report.deleteOne();

    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    next(error);
  }
};