const ContactUsSubmission = require("../models/contactUsSubmission");

const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await ContactUsSubmission.getAllSubmissions();
        res.json(submissions);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving submissions");
    }
};

const getSubmissionById = async (req, res) => {
    const submissionId = parseInt(req.params.id);
    try {
        const submission = await ContactUsSubmission.getSubmissionById(
            submissionId
        );
        if (!submission) {
            return res.status(404).send("Submission not found");
        }
        res.json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving submission");
    }
};

module.exports = {
    getAllSubmissions,
    getSubmissionById,
};
