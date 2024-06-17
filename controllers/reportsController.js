const Report = require("../models/report");

const getAllReports = async (req, res) => {
    try {
        const reports = await Report.getAllReports();
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving reports");
    }
};

const getReportById = async (req, res) => {
    const reportId = parseInt(req.params.id);
    try {
        const report = await Report.getReportById(reportId);
        if (!report) {
            return res.status(404).send("Report not found");
        }
        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving report");
    }
};

const deleteReport = async (req, res) => {
    const reportId = parseInt(req.params.id);
    try {
        const success = await Report.deleteReport(reportId);
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
    getAllReports,
    getReportById,
    deleteReport,
};
