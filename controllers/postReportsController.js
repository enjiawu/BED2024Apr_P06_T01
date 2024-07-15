const PostReport = require("../models/postReport");

const getAllPostReports = async (req, res) => {
    try {
        const reports = await PostReport.getAllPostReports();
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving reports");
    }
};

const getPostReportById = async (req, res) => {
    const reportId = parseInt(req.params.id);
    try {
        const report = await PostReport.getPostReportById(reportId);
        if (!report) {
            return res.status(404).send("Report not found");
        }
        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving report");
    }
};

const deletePostReport = async (req, res) => {
    const reportId = parseInt(req.params.id);
    try {
        const success = await PostReport.deletePostReport(reportId);
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
    getAllPostReports,
    getPostReportById,
    deletePostReport,
};
