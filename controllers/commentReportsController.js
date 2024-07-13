const CommentReport = require("../models/commentReport");

const getAllCommentReports = async (req, res) => {
    try {
        const reports = await CommentReport.getAllCommentReports();
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving reports");
    }
};

const getCommentReportById = async (req, res) => {
    const reportId = parseInt(req.params.id);
    try {
        const report = await CommentReport.getCommentReportById(reportId);
        if (!report) {
            return res.status(404).send("Report not found");
        }
        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving report");
    }
};

const deleteCommentReport = async (req, res) => {
    const reportId = parseInt(req.params.id);
    try {
        const success = await CommentReport.deleteCommentReport(reportId);
        if (!success) {
            return res.status(404).send("Report not found");
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting report");
    }
};

module.exports = {
    getAllCommentReports,
    getCommentReportById,
    deleteCommentReport,
};
