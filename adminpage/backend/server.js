/*server.js */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // If you need to serve static files

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/your_database_name'; // Replace with your MongoDB URI
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define the schema for formdatas collection
const formDataSchema = new mongoose.Schema({
  applicationFor: { type: String },
  fullName: { type: String, required: true },
  fatherName: { type: String },
  motherName: { type: String },
  gender: { type: String },
  dateOfBirth: { type: Date },
  email: { type: String, required: true },
  category: { type: String },
  address: { type: String },
  contactNumbers: { type: String },
  highestQualification: { type: String },
  testQualified: { type: String },
  yearOfQualifying: { type: Number },
  totalWorkExperience: { type: String },
  discipline: { type: String },
  educationDetails: [
    {
      degree: { type: String },
      board: { type: String },
      year: { type: Number },
      percentage: { type: Number },
      marksheet: { type: String }, // Store file path
    },
  ],
  workExperienceDetails: [
    {
      post: { type: String },
      company: { type: String },
      location: { type: String },
      domain: { type: String },
      fromYear: { type: String },
      toYear: { type: String },
      fromMonth: { type: String },
      toMonth: { type: String },
      
      duties: { type: String },
    },
  ],
  publications: [
    {
      title: { type: String },
      journal: { type: String },
    },
  ],
  registeredForPhD: { type: String },
  phdDetails: { type: String },
  phdDocuments: { type: String }, // Store file path
  convictedByCourt: { type: String },
  convictionDetails: { type: String },
  enquiryPending: { type: String },
  enquiryDetails: { type: String },
  chargedWithPlagiarism: { type: String },
  plagiarismDetails: { type: String },
  passportPhoto: { type: String }, // Store file path
});

// Create a model for formdatas collection
const FormData = mongoose.model('FormData', formDataSchema, 'formdatas');

// API Routes

// Fetch all entries for the dropdown from formdatas collection
app.get('/api/getEntries', async (req, res) => {
  try {
    const formData = await FormData.findOne(); // Fetch a single document to get the column names
    if (!formData) {
      return res.status(404).json({ error: 'No data found in formdatas collection' });
    }
    const entries = Object.keys(formData.toObject()); // Get column names from the document
    res.json(entries); // Return the column names for the dropdown
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// Fetch distinct constraint options for the selected entry (column name)
app.get('/api/getConstraintOptions', async (req, res) => {
  try {
    const { entry } = req.query;  // Get the entry (column name) from the query parameters

    // Ensure the entry is valid
    if (!entry) {
      return res.status(400).json({ error: 'No entry provided' });
    }

    // If the entry refers to a subfield of a nested array (like educationDetails.degree)
    if (entry.includes('.')) {
      const [fieldName, subfield] = entry.split('.');  // Split the entry into field name and subfield

      // Fetch distinct values for the subfield using dot notation
      const options = await FormData.distinct(`${fieldName}.${subfield}`);  
      res.json(options);  // Return the distinct options for the subfield
    } else {
      // Handle non-nested fields
      const options = await FormData.distinct(entry);  // Get distinct values for the column
      res.json(options);  // Return the distinct options for the column
    }
  } catch (err) {
    console.error('Error fetching constraint options:', err);
    res.status(500).json({ error: 'Failed to fetch constraint options' });
  }
});

// Fetch all data from formdatas collection
app.get('/api/getCandidates', async (req, res) => {
  try {
    const candidates = await FormData.find();  // Fetch all candidates from the database
    res.json(candidates);  // Send the candidates data as JSON
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Apply filters to fetch filtered candidates from formdatas collection
app.post('/api/filterCandidates', async (req, res) => {
  try {
    const { filters } = req.body;
    const query = {};

    filters.forEach((filter) => {
      // Only allow equality, and cast to correct type for numbers
      // Find the field in the schema that is a number
      
        query[filter.entry] = filter.constraint;
      
    });

    // Debug: log the query
    console.log('MongoDB filter query:', JSON.stringify(query, null, 2));

    const filteredData = await FormData.find(query);
    res.json(filteredData);
  } catch (err) {
    console.error('Error fetching filtered candidates:', err);
    res.status(500).json({ error: 'Failed to fetch filtered candidates' });
  }
});

// Place DELETE routes BEFORE app.use(express.static(...)) and any catch-all routes

// Delete all candidates
app.delete('/api/deleteAllCandidates', async (req, res) => {
  try {
    await FormData.deleteMany({});
    res.json({ message: 'All candidate data deleted successfully.' });
  } catch (err) {
    console.error('Error deleting all candidates:', err);
    res.status(500).json({ error: 'Failed to delete all candidates' });
  }
});

// Delete a single candidate by ID
app.delete('/api/deleteCandidate/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FormData.findByIdAndDelete(id);
    if (result) {
      res.json({ message: 'Candidate deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Candidate not found.' });
    }
  } catch (err) {
    console.error('Error deleting candidate:', err);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Candidate Shortlisting Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});