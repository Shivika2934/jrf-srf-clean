/*ReviewApply.js*/

import React, { useState } from 'react';

function ReviewApply({ formData, handleSubmit, prevStep }) {
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckboxChange = () => {
    setIsDeclarationChecked(!isDeclarationChecked);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!isDeclarationChecked) {
      setErrorMessage('Kindly mark the checkbox to confirm your agreement with the declaration before submitting.');
      return;
    }

    // Prepare FormData object for submission
    const submissionData = new FormData();
    submissionData.append('applicationFor', formData.applicationFor);
    submissionData.append('highestQualification', formData.highestQualification);
    submissionData.append('testQualified', formData.testQualified);
    submissionData.append('yearOfQualifying', formData.yearOfQualifying);
    submissionData.append('totalWorkExperience', formData.totalWorkExperience);
    submissionData.append('discipline', formData.discipline);
    submissionData.append('fullName', formData.fullName);
    submissionData.append('fatherName', formData.fatherName);
    submissionData.append('motherName', formData.motherName);
    submissionData.append('gender', formData.gender);
    submissionData.append('dateOfBirth', formData.dateOfBirth);
    submissionData.append('email', formData.email);
    submissionData.append('category', formData.category);
    submissionData.append('address', formData.address);
    submissionData.append('contactNumbers', formData.contactNumbers);

    // Append file inputs
    if (formData.photo && formData.photo.file) {
      submissionData.append('passportPhoto', formData.photo.file);
    }

    // Append education details
    formData.educationDetails.forEach((education, index) => {
      submissionData.append(`educationDetails[${index}][degree]`, education.degree);
      submissionData.append(`educationDetails[${index}][board]`, education.board);
      submissionData.append(`educationDetails[${index}][year]`, education.year);
      submissionData.append(`educationDetails[${index}][percentage]`, education.percentage);
      if (education.marksheet && education.marksheet.file) {
        submissionData.append(`educationDetails[${index}][marksheet]`, education.marksheet.file);
      }
    });

    // Append work experience details
    formData.workExperienceDetails.forEach((experience, index) => {
      submissionData.append(`workExperienceDetails[${index}][post]`, experience.post);
      submissionData.append(`workExperienceDetails[${index}][company]`, experience.company);
      submissionData.append(`workExperienceDetails[${index}][location]`, experience.location);
      submissionData.append(`workExperienceDetails[${index}][fromYear]`, experience.fromYear);
      submissionData.append(`workExperienceDetails[${index}][toYear]`, experience.toYear);
      submissionData.append(`workExperienceDetails[${index}][fromMonth]`, experience.fromMonth);
      submissionData.append(`workExperienceDetails[${index}][toMonth]`, experience.toMonth);
      submissionData.append(`workExperienceDetails[${index}][duties]`, experience.duties);
    });

    // Append publication details
    formData.publications.forEach((publication, index) => {
      submissionData.append(`publications[${index}][title]`, publication.title);
      submissionData.append(`publications[${index}][journal]`, publication.journal);
    });

    // Append PhD details if applicable
    if (formData.registeredForPhD === 'Yes') {
      if (formData.phdDocuments && formData.phdDocuments.file) {
        submissionData.append('phdDocuments', formData.phdDocuments.file);
      }
      submissionData.append('phdDetails', formData.phdDetails);
    }

    if (formData.convictedByCourt === 'Yes') {
      submissionData.append('convictionDetails', formData.convictionDetails);
    }

    if (formData.enquiryPending === 'Yes') {
      submissionData.append('enquiryDetails', formData.enquiryDetails);
    }

    if (formData.chargedWithPlagiarism === 'Yes') {
      submissionData.append('plagiarismDetails', formData.plagiarismDetails);
    }

    // Call handleSubmit with the prepared FormData
    handleSubmit(submissionData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h1>Review Your Application</h1>

      <div>
        <label>Application For:</label>
        <p>{formData.applicationFor}</p>
      </div>

      <div>
        <label>Highest Qualification:</label>
        <p>{formData.highestQualification}</p>
      </div>

      <div>
        <label>Test Qualified:</label>
        <p>{formData.testQualified}</p>
      </div>

      <div>
        <label>Year Of Qualifying:</label>
        <p>{formData.yearOfQualifying}</p>
      </div>

      <div>
        <label>Total Work Experience:</label>
        <p>{formData.totalWorkExperience}</p>
      </div>

      <div>
        <label>Discipline:</label>
        <p>{formData.discipline}</p>
      </div>

      <div>
        <label>Full Name:</label>
        <p>{formData.fullName}</p>
      </div>

      <div>
        <label>Uploaded Photo:</label>
        {formData.photo && formData.photo.fileUrl && (
          <div>
            <img src={formData.photo.fileUrl} alt="Uploaded Passport Size" style={{ width: '150px', height: '150px', objectFit: 'cover', border: '1px solid #ccc', borderRadius: '5px' }} />
          </div>
        )}
      </div>

      <div>
        <label>Father's Name:</label>
        <p>{formData.fatherName}</p>
      </div>

      <div>
        <label>Mother's Name:</label>
        <p>{formData.motherName}</p>
      </div>

      <div>
        <label>Gender:</label>
        <p>{formData.gender}</p>
      </div>

      <div>
        <label>Date of Birth:</label>
        <p>{formData.dateOfBirth}</p>
      </div>

      <div>
        <label>Email:</label>
        <p>{formData.email}</p>
      </div>

      <div>
        <label>Category:</label>
        <p>{formData.category}</p>
      </div>

      <div>
        <label>Address:</label>
        <p>{formData.address}</p>
      </div>

      <div>
        <label>Contact Numbers:</label>
        <p>{formData.contactNumbers}</p>
      </div>

      {/* Education Details */}
      <h3>Education Details:</h3>
      {(formData.educationDetails || []).map((education, index) => (
        <div key={index}>
          <p>Degree: {education.degree}</p>
          <p>Board: {education.board}</p>
          <p>Year: {education.year}</p>
          <p>Percentage: {education.percentage}</p>
          {education.marksheet && education.marksheet.fileUrl && (
            <div>
              <a href={education.marksheet.fileUrl} target="_blank" rel="noopener noreferrer">
                {education.marksheet.file.name}
              </a>
            </div>
          )}
        </div>
      ))}

      {/* Work Experience Details */}
      <h3>Work Experience Details:</h3>
      {(formData.workExperienceDetails || []).map((experience, index) => (
        <div key={index}>
          <p>Post: {experience.post}</p>
          <p>Company: {experience.company}</p>
          <p>Location: {experience.location}</p>
          <p>From Year: {experience.fromYear}</p>
          <p>From Month: {experience.fromMonth}</p>
          <p>To Year: {experience.toYear}</p>
          <p>To Month: {experience.toMonth}</p>
          <p>Duties: {experience.duties}</p>
        </div>
      ))}

      {/* Details of Publications */}
      <h3>Details of Publications:</h3>
      {(formData.publications || []).map((publication, index) => (
        <div key={index}>
          <p>Title: {publication.title}</p>
          <p>Journal: {publication.journal}</p>
        </div>
      ))}

      <h3>Other Information:</h3>
      <div>
        <p>Have you ever registered for PhD?: {formData.registeredForPhD}</p>
      </div>
      {formData.registeredForPhD === 'Yes' && (
        <>
          <div>
            {formData.phdDocuments && formData.phdDocuments.fileUrl && (
              <div>
                <a href={formData.phdDocuments.fileUrl} target="_blank" rel="noopener noreferrer">
                  {formData.phdDocuments.file.name}
                </a>
              </div>
            )}
          </div>
          <div>
            <p>PhD Details: {formData.phdDetails}</p>
          </div>
        </>
      )}

      <div>
        <p>Have you ever been convicted by a court of law?: {formData.convictedByCourt}</p>
        {formData.convictedByCourt === 'Yes' && (
          <div>
            <p>Details of Conviction: {formData.convictionDetails}</p>
          </div>
        )}
      </div>

      <div>
        <p>Is there any enquiry pending against you?: {formData.enquiryPending}</p>
        {formData.enquiryPending === 'Yes' && (
          <div>
            <p>Details of Pending Enquiry: {formData.enquiryDetails}</p>
          </div>
        )}
      </div>

      <div>
        <p>Have you ever been charged with plagiarism?: {formData.chargedWithPlagiarism}</p>
        {formData.chargedWithPlagiarism === 'Yes' && (
          <div>
            <p>Details of Plagiarism Charge: {formData.plagiarismDetails}</p>
          </div>
        )}
      </div>

      {/* Declaration */}
      <h3>Declaration:</h3>
      <div className="declaration-container">
        <input
          type="checkbox"
          className="declaration-checkbox"
          checked={isDeclarationChecked}
          onChange={handleCheckboxChange}
        />
        <label className="declaration-label">
          I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that any false information may lead to the rejection of my application.
        </label>
      </div>

      {/* Error message */}
      {errorMessage && <p style={{ color: 'white', background: 'red' }}>{errorMessage}</p>}

      <button type="button" onClick={prevStep}>Previous</button>&nbsp;&nbsp;
      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export default ReviewApply;
