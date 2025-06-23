/*SERVER.JS*/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');
const XLSX = require('xlsx');

const app = express();
const PORT = 5000;

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
            domain: String,
            fromYear: String,
            toYear: String,
            fromMonth: String,
            toMonth: String,
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
            domain: Joi.string().required(),
            fromYear: Joi.string().required(),
            toYear: Joi.string().required(),
            fromMonth: Joi.string().required(),
            toMonth: Joi.string().required(),
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
            } else if (file.fieldname === 'photo' || file.fieldname === 'passportPhoto') {
                // Accept both 'photo' and 'passportPhoto' for compatibility
                fileData.passportPhoto = file.path;
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

// Helper function to flatten nested fields and format dates
const flattenCandidateData = (candidate) => {
    const flatData = {};

    // Always include _id as the first column, fallback to empty string if not present
    flatData['_id'] = candidate._id ? candidate._id.toString() : '';

    Object.entries(candidate).forEach(([key, value]) => {
        if (key === '_id' || key === 'id' || key === '__v') return;
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                Object.entries(item).forEach(([nestedKey, nestedValue]) => {
                    // Show all work experience fields including domain, fromYear, toYear, fromMonth, toMonth
                    if (
                        nestedKey.toLowerCase().includes('date') ||
                        nestedKey === 'fromYear' ||
                        nestedKey === 'toYear' ||
                        nestedKey === 'fromMonth' ||
                        nestedKey === 'toMonth'
                    ) {
                        flatData[`${key}[${index + 1}].${nestedKey}`] = nestedValue && !isNaN(new Date(nestedValue).getTime())
                            ? new Date(nestedValue).toISOString().split('T')[0]
                            : nestedValue || '';
                    } else {
                        flatData[`${key}[${index + 1}].${nestedKey}`] = nestedValue || '';
                    }
                });
            });
        } else if (key.toLowerCase().includes('date')) {
            flatData[key] = value && !isNaN(new Date(value).getTime())
                ? new Date(value).toISOString().split('T')[0]
                : '';
        } else {
            flatData[key] = value || '';
        }
    });

    return flatData;
};

// Endpoint to download data as an Excel file (with optional filters)
app.post('/api/downloadExcel', async (req, res) => {
    try {
        const { filters } = req.body || {}; // Get filters from the request body
        const query = {};

        // Apply filters to the query
        if (filters && filters.length > 0) {
            filters.forEach((filter) => {
                query[filter.entry] = filter.constraint;
            });
        }

        console.log('Query for filtered data:', query); // Debugging: Log the query

        const candidates = await FormData.find(query); // Fetch filtered candidates from the database

        if (!candidates || candidates.length === 0) {
            console.log('No candidates found for the given filters.');
            return res.status(404).json({ error: 'No candidates found to export' });
        }

        // Flatten all candidate data
        const flattenedData = candidates.map((candidate) => flattenCandidateData(candidate.toObject()));

        // Debugging: Log the flattened data to verify
        console.log('Flattened Data:', flattenedData);

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(flattenedData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');

        // Write the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Debugging: Log success before sending the file
        console.log('Excel file generated successfully.');

        // Set response headers and send the file
        res.setHeader('Content-Disposition', 'attachment; filename="candidates.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        console.error('Error generating Excel file:', err);
        res.status(500).json({ error: 'Failed to generate Excel file' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

