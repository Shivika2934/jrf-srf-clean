/* DocumentsUpload.js */

import React, { useState } from 'react';

function DocumentsUpload({
  formData,
  handlePublicationChange,
  addPublicationField,
  handlePhdFileChange,
  handleChange,
  removePublicationField,
  handleSubmit,
  prevStep,
  nextStep
}) {
  const [errors, setErrors] = useState({});

  // Validate all required fields
  const validateForm = () => {
    let formValid = true;
    let errors = {};

    // Validate publications
    formData.publications.forEach((publication, index) => {
      if (!publication.title) {
        formValid = false;
        errors[`title_${index}`] = `Title is required for publication ${index + 1}`;
      }
      if (!publication.journal) {
        formValid = false;
        errors[`journal_${index}`] = `Journal details are required for publication ${index + 1}`;
      }
    });

    // Validate PhD registration
    if (!formData.registeredForPhD) {
      formValid = false;
      errors.registeredForPhD = "Please select if you have registered for PhD.";
    } 
    else if (formData.registeredForPhD === 'Yes') {
      // Only validate PhD details if "Yes" is selected
      if (!formData.phdDetails) {
        formValid = false;
        errors.phdDetails = "Please provide PhD details if registered.";
      }
      if (!formData.phdDocuments) {
        formValid = false;
        errors.phdDocuments = "Please upload PhD document if registered.";
      }
    }

    // Validate court conviction
    if (!formData.convictedByCourt) {
      formValid = false;
      errors.convictedByCourt = "Please select if you have been convicted by a court.";
    } else if (formData.convictedByCourt === 'Yes' && !formData.convictionDetails) {
      formValid = false;
      errors.convictionDetails = "Please provide details of conviction.";
    }

    // Validate enquiry pending
    if (!formData.enquiryPending) {
      formValid = false;
      errors.enquiryPending = "Please select if there is any enquiry pending against you.";
    } else if (formData.enquiryPending === 'Yes' && !formData.enquiryDetails) {
      formValid = false;
      errors.enquiryDetails = "Please provide enquiry details.";
    }

    // Validate plagiarism charge
    if (!formData.chargedWithPlagiarism) {
      formValid = false;
      errors.chargedWithPlagiarism = "Please select if you have been charged with plagiarism.";
    } else if (formData.chargedWithPlagiarism === 'Yes' && !formData.plagiarismDetails) {
      formValid = false;
      errors.plagiarismDetails = "Please provide details of plagiarism charges.";
    }

    setErrors(errors);
    return formValid;
  };

  // Handle next step with validation
  const handleNextStep = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Self Declaration</h1>
      <h3>Details of Publications (Add more as needed):</h3>

      {formData.publications.map((publication, index) => (
        <div key={index}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={publication.title}
            onChange={(e) => handlePublicationChange(index, e)}
          />
          {errors[`title_${index}`] && <span className="error">{errors[`title_${index}`]}</span>}

          <input
            type="text"
            name="journal"
            placeholder="Journal, Vol., Page No., Year, Impact Factor, etc."
            value={publication.journal}
            onChange={(e) => handlePublicationChange(index, e)}
          />
          {errors[`journal_${index}`] && <span className="error">{errors[`journal_${index}`]}</span>}

          {index > 0 && (
            <button type="button" onClick={() => removePublicationField(index)}>Remove</button>
          )}
        </div>
      ))}

      <button type="button" onClick={addPublicationField}>Add Publication</button>

      <h3>PhD and Other Information:</h3>

      <div>
        <label>Have you ever registered for PhD?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="registeredForPhD"
              value="Yes"
              checked={formData.registeredForPhD === 'Yes'}
              onChange={handleChange}
            /> Yes
          </label>
          <label>
            <input
              type="radio"
              name="registeredForPhD"
              value="No"
              checked={formData.registeredForPhD === 'No'}
              onChange={handleChange}
            /> No
          </label>
        </div>
        {errors.registeredForPhD && <span className="error">{errors.registeredForPhD}</span>}

        {formData.registeredForPhD === 'Yes' && (
          <div className="phd-details">
            <label>Please upload relevant PhD documents:</label>
            <input
              type="file"
              name="phdDocuments"
              accept=".pdf"
              onChange={handlePhdFileChange}
              className="custom-file-input"
            />
            {/* Display the uploaded PhD document link if it exists */}
            {formData.phdDocuments && formData.phdDocuments.fileUrl && (
              <div>
                <a href={formData.phdDocuments.fileUrl} target="_blank" rel="noopener noreferrer">
                  {formData.phdDocuments.file.name}
                </a>
              </div>
            )}
            {errors.phdDocuments && <span className="error">{errors.phdDocuments}</span>}
            <label>Please give details:</label>
            <textarea
              name="phdDetails"
              value={formData.phdDetails}
              onChange={handleChange}
            />
            {errors.phdDetails && <span className="error">{errors.phdDetails}</span>}
          </div>
        )}
      </div>

      {/* Other sections (court conviction, enquiry, plagiarism) */}
      <div>
        <label>Have you ever been convicted by a court of law?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="convictedByCourt"
              value="Yes"
              checked={formData.convictedByCourt === 'Yes'}
              onChange={handleChange}
            /> Yes
          </label>
          <label>
            <input
              type="radio"
              name="convictedByCourt"
              value="No"
              checked={formData.convictedByCourt === 'No'}
              onChange={handleChange}
            /> No
          </label>
        </div>
        {errors.convictedByCourt && <span className="error">{errors.convictedByCourt}</span>}

        {formData.convictedByCourt === 'Yes' && (
          <div className="conviction-details">
            <label>Please give details:</label>
            <textarea
              name="convictionDetails"
              value={formData.convictionDetails}
              onChange={handleChange}
            />
            {errors.convictionDetails && <span className="error">{errors.convictionDetails}</span>}
          </div>
        )}
      </div>

      <div>
        <label>Is there any enquiry pending against you?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="enquiryPending"
              value="Yes"
              checked={formData.enquiryPending === 'Yes'}
              onChange={handleChange}
            /> Yes
          </label>
          <label>
            <input
              type="radio"
              name="enquiryPending"
              value="No"
              checked={formData.enquiryPending === 'No'}
              onChange={handleChange}
            /> No
          </label>
        </div>
        {errors.enquiryPending && <span className="error">{errors.enquiryPending}</span>}

        {formData.enquiryPending === 'Yes' && (
          <div className="enquiry-details">
            <label>Please give details:</label>
            <textarea
              name="enquiryDetails"
              value={formData.enquiryDetails}
              onChange={handleChange}
            />
            {errors.enquiryDetails && <span className="error">{errors.enquiryDetails}</span>}
          </div>
        )}
      </div>

      <div>
        <label>Have you ever been charged with plagiarism?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="chargedWithPlagiarism"
              value="Yes"
              checked={formData.chargedWithPlagiarism === 'Yes'}
              onChange={handleChange}
            /> Yes
          </label>
          <label>
            <input
              type="radio"
              name="chargedWithPlagiarism"
              value="No"
              checked={formData.chargedWithPlagiarism === 'No'}
              onChange={handleChange}
            /> No
          </label>
        </div>
        {errors.chargedWithPlagiarism && <span className="error">{errors.chargedWithPlagiarism}</span>}

        {formData.chargedWithPlagiarism === 'Yes' && (
          <div className="plagiarism-details">
            <label>Please give details:</label>
            <textarea
              name="plagiarismDetails"
              value={formData.plagiarismDetails}
              onChange={handleChange}
            />
            {errors.plagiarismDetails && <span className="error">{errors.plagiarismDetails}</span>}
          </div>
        )}
      </div>

      <div>
        <button type="button" onClick={prevStep}>Previous</button>&nbsp;&nbsp;
        <button type="button" onClick={handleNextStep}>Next</button>
      </div>
    </form>
  );
}

export default DocumentsUpload;
