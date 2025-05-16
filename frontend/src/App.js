/* App.js */

import React, { useState } from 'react';
import './App.css';
import logo1 from './logo1.png';
import logo2 from './logo2.png';
import PersonalInfo from './PersonalInfo';
import Qualifications from './Qualifications';
import DocumentsUpload from './DocumentsUpload';
import ReviewApply from './ReviewApply';

function App() {
  const [formData, setFormData] = useState({
    applicationFor: '',
    photo: null,
    fullName: '',
    fatherName: '',
    motherName: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    category: '',
    address: '',
    contactNumbers: '',
    highestQualification: '',
    testQualified: '',
    yearOfQualifying: '',
    totalWorkExperience: '',
    discipline: '',
    educationDetails: [{ degree: '', board: '', year: '', percentage: '', marksheet: null }],
    workExperienceDetails: [{ post: '', company: '', location: '', from: '', to: '', duties: '' }],
    publications: [{ title: '', journal: '' }],
    registeredForPhD: '',
    phdDetails: '',
    phdDocuments: null,
    convictedByCourt: '',
    convictionDetails: '',
    enquiryPending: '',
    enquiryDetails: '',
    chargedWithPlagiarism: '',
    plagiarismDetails: ''
  });

  const [step, setStep] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoUploadChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setFormData({ ...formData, photo: createFileUrlObject(file) });
    } else {
      alert('Only JPEG or PNG images are allowed for photo upload');
    }
  };

  const createFileUrlObject = (file) => ({
    file,
    fileUrl: URL.createObjectURL(file)
  });

  const handlePhdFileUploadChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, phdDocuments: createFileUrlObject(file) });
    } else {
      alert('Only PDF files are allowed for PhD document upload');
    }
  };

  const handleMarksheetFileUploadChange = (event, index) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const newEducationDetails = formData.educationDetails.map((edu, eduIndex) => {
        if (index === eduIndex) {
          return { ...edu, marksheet: createFileUrlObject(file) };
        }
        return edu;
      });
      setFormData({ ...formData, educationDetails: newEducationDetails });
    } else {
      alert('Only PDF files are allowed for marksheet upload');
    }
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducationDetails = formData.educationDetails.map((edu, eduIndex) => {
      if (index === eduIndex) {
        return { ...edu, [name]: value };
      }
      return edu;
    });
    setFormData({ ...formData, educationDetails: newEducationDetails });
  };

  const addEducationField = () => {
    setFormData({
      ...formData,
      educationDetails: [...formData.educationDetails, { degree: '', board: '', year: '', percentage: '', marksheet: null }]
    });
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newWorkExperienceDetails = formData.workExperienceDetails.map((exp, expIndex) => {
      if (index === expIndex) {
        return { ...exp, [name]: value };
      }
      return exp;
    });
    setFormData({ ...formData, workExperienceDetails: newWorkExperienceDetails });
  };

  const removeEducationField = (index) => {
    const updatedEducationDetails = formData.educationDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, educationDetails: updatedEducationDetails });
  };

  const removeExperienceField = (index) => {
    const newExperienceDetails = formData.workExperienceDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, workExperienceDetails: newExperienceDetails });
  };

  const addExperienceField = () => {
    setFormData({
      ...formData,
      workExperienceDetails: [...formData.workExperienceDetails, { post: '', company: '', location: '', from: '', to: '', duties: '' }]
    });
  };

  const handlePublicationChange = (index, event) => {
    const { name, value } = event.target;
    const newPublications = [...formData.publications];
    newPublications[index] = {
      ...newPublications[index],
      [name]: value,
    };
    setFormData({ ...formData, publications: newPublications });
  };

  const addPublicationField = () => {
    setFormData({
      ...formData,
      publications: [...formData.publications, { title: '', journal: '' }],
    });
  };

  const removePublicationField = (index) => {
    const newPublications = formData.publications.filter((_, i) => i !== index);
    setFormData({ ...formData, publications: newPublications });
  };

  const handleSubmit = async () => {
    try {
      if (!validateStep()) {
        alert("Please ensure all steps are completed properly.");
        return;
      }
  
      const formDataToSubmit = new FormData();
  
      // Append text fields
      formDataToSubmit.append('applicationFor', formData.applicationFor);
      formDataToSubmit.append('fullName', formData.fullName);
      formDataToSubmit.append('fatherName', formData.fatherName);
      formDataToSubmit.append('motherName', formData.motherName);
      formDataToSubmit.append('gender', formData.gender);
      formDataToSubmit.append('dateOfBirth', formData.dateOfBirth);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('address', formData.address);
      formDataToSubmit.append('contactNumbers', formData.contactNumbers);
      formDataToSubmit.append('highestQualification', formData.highestQualification);
      formDataToSubmit.append('testQualified', formData.testQualified);
      formDataToSubmit.append('yearOfQualifying', formData.yearOfQualifying);
      formDataToSubmit.append('totalWorkExperience', formData.totalWorkExperience);
      formDataToSubmit.append('discipline', formData.discipline);
      formDataToSubmit.append('registeredForPhD', formData.registeredForPhD);
      formDataToSubmit.append('phdDetails', formData.phdDetails || '');
      formDataToSubmit.append('convictedByCourt', formData.convictedByCourt);
      formDataToSubmit.append('convictionDetails', formData.convictionDetails || '');
      formDataToSubmit.append('enquiryPending', formData.enquiryPending);
      formDataToSubmit.append('enquiryDetails', formData.enquiryDetails || '');
      formDataToSubmit.append('chargedWithPlagiarism', formData.chargedWithPlagiarism);
      formDataToSubmit.append('plagiarismDetails', formData.plagiarismDetails || '');
  
      // Append file inputs
      if (formData.photo && formData.photo.file) {
        formDataToSubmit.append('photo', formData.photo.file);
      }
      if (formData.phdDocuments && formData.phdDocuments.file) {
        formDataToSubmit.append('phdDocuments', formData.phdDocuments.file);
      }
  
      // Append education details
      formData.educationDetails.forEach((education, index) => {
        formDataToSubmit.append(`educationDetails[${index}][degree]`, education.degree);
        formDataToSubmit.append(`educationDetails[${index}][board]`, education.board);
        formDataToSubmit.append(`educationDetails[${index}][year]`, education.year);
        formDataToSubmit.append(`educationDetails[${index}][percentage]`, education.percentage);
        if (education.marksheet && education.marksheet.file) {
          formDataToSubmit.append(`educationDetails[${index}][marksheet]`, education.marksheet.file);
        }
      });
  
      // Append work experience details
      formData.workExperienceDetails.forEach((experience, index) => {
        formDataToSubmit.append(`workExperienceDetails[${index}][post]`, experience.post);
        formDataToSubmit.append(`workExperienceDetails[${index}][company]`, experience.company);
        formDataToSubmit.append(`workExperienceDetails[${index}][location]`, experience.location);
        formDataToSubmit.append(`workExperienceDetails[${index}][from]`, experience.from);
        formDataToSubmit.append(`workExperienceDetails[${index}][to]`, experience.to);
        formDataToSubmit.append(`workExperienceDetails[${index}][duties]`, experience.duties);
      });
  
      // Append publications
      formData.publications.forEach((publication, index) => {
        formDataToSubmit.append(`publications[${index}][title]`, publication.title);
        formDataToSubmit.append(`publications[${index}][journal]`, publication.journal);
      });
  
      // Make the fetch request
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        body: formDataToSubmit,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log('Form submitted successfully:', responseData);
      alert("Application submitted successfully!");
      // Reset form data
      setFormData({
        applicationFor: '',
        photo: null,
        fullName: '',
        fatherName: '',
        motherName: '',
        gender: '',
        dateOfBirth: '',
        email: '',
        category: '',
        address: '',
        contactNumbers: '',
        highestQualification: '',
        testQualified: '',
        yearOfQualifying: '',
        totalWorkExperience: '',
        discipline: '',
        educationDetails: [{ degree: '', board: '', year: '', percentage: '', marksheet: null }],
        workExperienceDetails: [{ post: '', company: '', location: '', from: '', to: '', duties: '' }],
        publications: [{ title: '', journal: '' }],
        registeredForPhD: '',
        phdDetails: '',
        phdDocuments: null,
        convictedByCourt: '',
        convictionDetails: '',
        enquiryPending: '',
        enquiryDetails: '',
        chargedWithPlagiarism: '',
        plagiarismDetails: ''
      });
      setStep(1);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("There was an error submitting your application. Please try again.");
    }
  };
  
  const validateStep = () => {
    switch (step) {
      case 1: {
        const { applicationFor, photo, fullName, fatherName, motherName, gender, dateOfBirth, email, category, address, contactNumbers} = formData;
        return (
          applicationFor &&
          photo &&
          fullName &&
          fatherName &&
          motherName &&
          gender &&
          dateOfBirth &&
          email &&
          category &&
          address &&
          contactNumbers
        );
      }
      case 2: {
        const { highestQualification, testQualified, yearOfQualifying, totalWorkExperience, educationDetails, workExperienceDetails } = formData;
        return (
          highestQualification &&
          testQualified &&
          yearOfQualifying &&
          totalWorkExperience &&
          educationDetails.every(edu => edu.degree && edu.board && edu.year && edu.percentage && edu.marksheet) &&
          workExperienceDetails.every(exp => exp.post && exp.company && exp.location && exp.from && exp.to && exp.duties)
        );
      }
      case 3: {
        const { registeredForPhD, phdDetails, phdDocuments, convictedByCourt, convictionDetails, enquiryPending, enquiryDetails, chargedWithPlagiarism, plagiarismDetails } = formData;
        let valid = true;
        if (registeredForPhD === 'Yes') valid = valid && phdDetails && phdDocuments;
        if (convictedByCourt === 'Yes') valid = valid && convictionDetails;
        if (enquiryPending === 'Yes') valid = valid && enquiryDetails;
        if (chargedWithPlagiarism === 'Yes') valid = valid && plagiarismDetails;
        return valid;
      }
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCompletedSteps([...completedSteps, step]);
      setStep(step + 1);
    } else {
      alert('Please complete all required fields in this step before proceeding.');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goToStep = (stepNumber) => {
    if (stepNumber <= step || isStepCompleted(stepNumber)) {
      setStep(stepNumber);
    } else {
      alert('You need to complete the current step before proceeding.');
    }
  };

  const isStepCompleted = (stepNumber) => completedSteps.includes(stepNumber);

  return (
    <div>
      <div className="header">
        <img src={logo1} alt="National Emblem" />
        <div className="line"></div>
        <img src={logo2} alt="DRDO Logo" />
        <div className="text">
          <div className="hindi-text">रक्षा अनुसंधान एवं विकास संगठन</div>
          <div className="hindi-text">रक्षा मंत्रालय, भारत सरकार</div>
          <div className="main-title">DEFENCE RESEARCH & <br /> DEVELOPMENT ORGANISATION</div>
          <div className="sub-title">Ministry of Defence, Government of India</div>
        </div>
        <div className="line"></div>
        <div className="text">
          <div className="main-titlee">Solid State Physics Laboratory (SSPL)</div>
        </div>
      </div>
      <div className="sub-header">
        <div className="menu-icon" onClick={toggleMenu}>&#9776;</div>
        <b>DRDO Vacancy Form</b>
      </div>
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => goToStep(1)} className={isStepCompleted(1) ? 'completed' : ''}>
            <span className={`check-circle ${isStepCompleted(1) ? 'checked' : ''}`} data-step="1"></span>
            Personal Information
          </li>
          <li onClick={() => goToStep(2)} className={isStepCompleted(2) ? 'completed' : ''}>
            <span className={`check-circle ${isStepCompleted(2) ? 'checked' : ''}`} data-step="2"></span>
            Qualifications
          </li>
          <li onClick={() => goToStep(3)} className={isStepCompleted(3) ? 'completed' : ''}>
            <span className={`check-circle ${isStepCompleted(3) ? 'checked' : ''}`} data-step="3"></span>
            Self Declaration 
          </li>
          <li onClick={() => goToStep(4)} className={isStepCompleted(4) ? 'completed' : ''}>
            <span className={`check-circle ${isStepCompleted(4) ? 'checked' : ''}`} data-step="4"></span>
            Review & Apply
          </li>
        </ul>
      </div>
      <div className="form-container">
        {step === 1 && (
          <PersonalInfo 
            formData={formData} 
            handlePhotoChange={handlePhotoUploadChange} 
            handleChange={handleChange}  
            nextStep={nextStep} 
          />
        )}
        {step === 2 && (
          <Qualifications
            formData={formData}
            handleChange={handleChange}
            handleEducationChange={handleEducationChange}
            handleMarksheetFileChange={(e, index) => handleMarksheetFileUploadChange(e, index)}
            removeEducationField={removeEducationField}
            handleExperienceChange={handleExperienceChange}
            addExperienceField={addExperienceField}
            removeExperienceField={removeExperienceField}
            addEducationField={addEducationField}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 3 && (
          <DocumentsUpload
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handlePhdFileChange={handlePhdFileUploadChange}
            handlePublicationChange={handlePublicationChange}
            removePublicationField={removePublicationField}
            addPublicationField={addPublicationField}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 4 && (
          <ReviewApply
            formData={formData}
            handleSubmit={handleSubmit}
            prevStep={prevStep}
          />
        )}
      </div>
    </div>
  );
}

export default App;
