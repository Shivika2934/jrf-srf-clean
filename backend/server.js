/*SERVER.JS*/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');

const app = express();
const PORT = 5000;

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/your_database_name'; // Replace with your database name
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define a Schema
const formSchema = new mongoose.Schema({
    applicationFor: String,
    fullName: String,
    fatherName: String,
    motherName: String,
    gender: String,
    dateOfBirth: Date,
    email: String,
    category: String,
    address: String,
    contactNumbers: String,
    highestQualification: String,
    testQualified: String,
    yearOfQualifying: Number,
    totalWorkExperience: String,
    discipline: String,
    educationDetails: [
        {
            degree: String,
            board: String,
            year: Number,
            percentage: Number,
            marksheet: String, // Store file path
        },
    ],
    workExperienceDetails: [
        {
            post: String,
            company: String,
            location: String,
            from: String,
            to: String,
            duties: String,
        },
    ],
    publications: [
        {
            title: String,
            journal: String,
        },
    ],
    registeredForPhD: String,
    phdDetails: String,
    phdDocuments: String, // Store file path
    convictedByCourt: String,
    convictionDetails: String,
    enquiryPending: String,
    enquiryDetails: String,
    chargedWithPlagiarism: String,
    plagiarismDetails: String,
    passportPhoto: String, // Store file path
});

// Create a Model
const FormData = mongoose.model('FormData', formSchema);

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        try {
            await fs.promises.access(uploadPath);
        } catch {
            await fs.promises.mkdir(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

// Default Route
app.get('/', (req, res) => {
    res.send('Backend server is running successfully!');
});

// Validation Schema
const formValidationSchema = Joi.object({
    applicationFor: Joi.string().required(),
    fullName: Joi.string().required(),
    fatherName: Joi.string().required(),
    motherName: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    dateOfBirth: Joi.date().required(),
    email: Joi.string().email().required(),
    category: Joi.string().required(),
    address: Joi.string().required(),
    contactNumbers: Joi.string().pattern(/^\d{10}$/).required(),
    highestQualification: Joi.string().required(),
    testQualified: Joi.string().valid('Both NET & GATE', 'NET (Fellowship)', 'NET (Lectureship)', 'GATE', 'Neither NET Nor GATE').required(),
    yearOfQualifying: Joi.number().required(),
    totalWorkExperience: Joi.string().required(),
    discipline: Joi.string().required(),
    educationDetails: Joi.array().items(
        Joi.object({
            degree: Joi.string().required(),
            board: Joi.string().required(),
            year: Joi.number().required(),
            percentage: Joi.number().required(),
        })
    ).required(),
    workExperienceDetails: Joi.array().items(
        Joi.object({
            post: Joi.string().required(),
            company: Joi.string().required(),
            location: Joi.string().required(),
            from: Joi.string().required(),
            to: Joi.string().required(),
            duties: Joi.string().required(),
        })
    ).required(),
    publications: Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            journal: Joi.string().required(),
        })
    ),
    registeredForPhD: Joi.string().valid('Yes', 'No').required(),
    phdDetails: Joi.string().allow('').when('registeredForPhD', { is: 'Yes', then: Joi.required() }),
    convictedByCourt: Joi.string().valid('Yes', 'No').required(),
    convictionDetails: Joi.string().allow('').when('convictedByCourt', { is: 'Yes', then: Joi.required() }),
    enquiryPending: Joi.string().valid('Yes', 'No').required(),
    enquiryDetails: Joi.string().allow('').when('enquiryPending', { is: 'Yes', then: Joi.required() }),
    chargedWithPlagiarism: Joi.string().valid('Yes', 'No').required(),
    plagiarismDetails: Joi.string().allow('').when('chargedWithPlagiarism', { is: 'Yes', then: Joi.required() }),
});

// Route to Handle Form Submission
// Route to Handle Form Submission
app.post('/api/submit', upload.any(), async (req, res) => {
    try {
        // Log incoming request body and files
        console.log('Request body before validation:', req.body);
        console.log('Request files:', req.files);

        // Validate incoming form data
        const validation = formValidationSchema.validate(req.body);
        if (validation.error) {
            console.error('Validation Error:', validation.error.details);
            return res.status(400).json({ message: 'Validation error', error: validation.error.details });
        }
        console.log('Validation success, proceeding...');

        const {
            applicationFor,
            fullName,
            fatherName,
            motherName,
            gender,
            dateOfBirth,
            email,
            category,
            address,
            contactNumbers,
            highestQualification,
            testQualified,
            yearOfQualifying,
            totalWorkExperience,
            discipline,
            registeredForPhD,
            phdDetails,
            convictedByCourt,
            convictionDetails,
            enquiryPending,
            enquiryDetails,
            chargedWithPlagiarism,
            plagiarismDetails,
        } = req.body;

        // Ensure fields are always arrays
        const educationDetailsArray = Array.isArray(req.body.educationDetails) ? req.body.educationDetails : [req.body.educationDetails];
        const workExperienceDetailsArray = Array.isArray(req.body.workExperienceDetails) ? req.body.workExperienceDetails : [req.body.workExperienceDetails];
        const publicationsArray = Array.isArray(req.body.publications) ? req.body.publications : [req.body.publications];

        // Process files and save file paths
        const fileData = {};
        req.files.forEach(file => {
            if (file.fieldname.startsWith('educationDetails')) {
                const indexMatch = file.fieldname.match(/educationDetails\[(\d+)\]/);
                if (indexMatch) {
                    const index = indexMatch[1];
                    if (!fileData.educationDetails) fileData.educationDetails = [];
                    fileData.educationDetails[index] = fileData.educationDetails[index] || {};
                    fileData.educationDetails[index].marksheet = file.path;
                }
            } else {
                fileData[file.fieldname] = file.path;
            }
        });

        // Map the education details with file data if applicable
        const educationDetailsParsed = educationDetailsArray.map((education, index) => ({
            ...education,
            marksheet: fileData.educationDetails && fileData.educationDetails[index] ? fileData.educationDetails[index].marksheet : null,
        }));

        // Create and save form data to MongoDB
        const formData = new FormData({
            applicationFor,
            fullName,
            fatherName,
            motherName,
            gender,
            dateOfBirth,
            email,
            category,
            address,
            contactNumbers,
            highestQualification,
            testQualified,
            yearOfQualifying,
            totalWorkExperience,
            discipline,
            educationDetails: educationDetailsParsed,
            workExperienceDetails: workExperienceDetailsArray,
            publications: publicationsArray,
            registeredForPhD,
            phdDetails,
            phdDocuments: fileData.phdDocuments,
            convictedByCourt,
            convictionDetails,
            enquiryPending,
            enquiryDetails,
            chargedWithPlagiarism,
            plagiarismDetails,
            passportPhoto: fileData.passportPhoto,
        });

        console.log('Ready to save to MongoDB:', formData);

        await formData.save();
        console.log('Form data saved successfully');

        res.status(200).json({ message: 'Form data submitted successfully!' });

    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ message: 'An error occurred while submitting the form.', error });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

