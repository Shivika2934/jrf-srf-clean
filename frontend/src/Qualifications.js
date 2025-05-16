/* Qualifications.js */

import React, { useState } from 'react';

function Qualifications({
  formData,
  handleChange,
  handleEducationChange,
  handleExperienceChange,
  handleMarksheetFileChange,
  addEducationField,
  removeEducationField,
  addExperienceField,
  removeExperienceField,
  nextStep,
  prevStep
}) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formValid = true;
    let errors = {};

    // Validate highest qualification
    if (!formData.highestQualification) {
      formValid = false;
      errors.highestQualification = 'Highest Qualification is required';
    }

    // Validate test qualified
    if (!formData.testQualified) {
      formValid = false;
      errors.testQualified = 'Test Qualified is required';
    }

    // Validate year of qualifying NET/GATE
    if (!formData.yearOfQualifying) {
      formValid = false;
      errors.yearOfQualifying = 'Year of qualifying NET/GATE is required';
    }

    // Validate total work experience
    if (!formData.totalWorkExperience) {
      formValid = false;
      errors.totalWorkExperience = 'Total Work Experience is required';
    }

    // Validate discipline
    if (!formData.discipline) {
      formValid = false;
      errors.discipline = 'Discipline is required';
    }

    // Validate educational details
    formData.educationDetails.forEach((education, index) => {
      if (!education.degree) {
        formValid = false;
        errors[`degree_${index}`] = `Degree is required for entry ${index + 1}`;
      }
      if (!education.board) {
        formValid = false;
        errors[`board_${index}`] = `Board/University is required for entry ${index + 1}`;
      }
      if (!education.year) {
        formValid = false;
        errors[`year_${index}`] = `Year of Passing is required for entry ${index + 1}`;
      }
      if (!education.percentage) {
        formValid = false;
        errors[`percentage_${index}`] = `Percentage/CGPA is required for entry ${index + 1}`;
      }
      if (!education.marksheet) {
        formValid = false;
        errors[`marksheet_${index}`] = `Marksheet is required for entry ${index + 1}`;
      }
    });

    // Validate work experience details
    formData.workExperienceDetails.forEach((experience, index) => {
      if (!experience.post) {
        formValid = false;
        errors[`post_${index}`] = `Post Held is required for entry ${index + 1}`;
      }
      if (!experience.company) {
        formValid = false;
        errors[`company_${index}`] = `Company/Institute is required for entry ${index + 1}`;
      }
      if (!experience.location) {
        formValid = false;
        errors[`location_${index}`] = `Location is required for entry ${index + 1}`;
      }
      if (!experience.from) {
        formValid = false;
        errors[`from_${index}`] = `From Date is required for entry ${index + 1}`;
      }
      if (!experience.to) {
        formValid = false;
        errors[`to_${index}`] = `To Date is required for entry ${index + 1}`;
      }
      if (!experience.duties) {
        formValid = false;
        errors[`duties_${index}`] = `Duties Performed are required for entry ${index + 1}`;
      }
    });

    setErrors(errors);
    return formValid;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <form>
      <h1>Qualifications</h1>
      <div>
        <label>What is your highest relevant educational qualification?</label>
        <select name="highestQualification" value={formData.highestQualification} onChange={handleChange}>
          <option value="">Select</option>
          <option value="PhD">PhD</option>
          <option value="M. Tech. / M.E.">M. Tech. / M.E.</option>
          <option value="M. Sc.">M. Sc.</option>
          <option value="B. Tech. / B.E.">B. Tech. / B.E.</option>
        </select>
        {errors.highestQualification && <span className="error">{errors.highestQualification}</span>}
      </div>
      <div>
        <label>Which Test you have qualified?</label>
        <select name="testQualified" value={formData.testQualified} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Both NET & GATE">Both NET & GATE</option>
          <option value="NET (Fellowship)">NET (Fellowship)</option>
          <option value="NET (Lectureship)">NET (Lectureship)</option>
          <option value="GATE">GATE</option>
          <option value="Neither NET Nor GATE">Neither NET Nor GATE</option>
        </select>
        {errors.testQualified && <span className="error">{errors.testQualified}</span>}
      </div>
      <div>
        <label>What is the year of qualifying NET/GATE?</label>
        <input 
          type="number" 
          name="yearOfQualifying" 
          value={formData.yearOfQualifying} 
          onChange={handleChange} 
          min="2005" 
          max={new Date().getFullYear()} // This will set the maximum value to the current year
        />
        {errors.yearOfQualifying && <span className="error">{errors.yearOfQualifying}</span>}
      </div>
      <div>
        <label>Total Work Experience:</label>
        <select name="totalWorkExperience" value={formData.totalWorkExperience} onChange={handleChange}>
          <option value="">Select</option>
          <option value="> 3 Years">{'>'} 3 Years</option>
          <option value="Between 3 Year & 1 Year">Between 3 Year & 1 Year</option>
          <option value="< 1 Year">{'<'} 1 Year</option>
          <option value="Nil">Nil</option>
        </select>
        {errors.totalWorkExperience && <span className="error">{errors.totalWorkExperience}</span>}
      </div>
      <div>
        <label>Discipline:</label>
        <input type="text" name="discipline" value={formData.discipline} onChange={handleChange} />
        {errors.discipline && <span className="error">{errors.discipline}</span>}
      </div>

      {/* Educational Details Section */}
      <h3>Educational Details:</h3>
      {formData.educationDetails.map((education, index) => (
        <div key={index}>
          <select name="degree" value={education.degree} onChange={(e) => handleEducationChange(index, e)}>
            <option value="">Select Degree</option>
            <option value="Secondary">Secondary</option>
            <option value="Senior Secondary">Senior Secondary</option>
            <option value="Bachelors">Bachelors</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>
          {errors[`degree_${index}`] && <span className="error">{errors[`degree_${index}`]}</span>}
          <input
            type="text"
            name="board"
            placeholder="Board/University"
            value={education.board}
            onChange={(e) => handleEducationChange(index, e)}
          />
          {errors[`board_${index}`] && <span className="error">{errors[`board_${index}`]}</span>}
          <input
            type="text"
            name="year"
            placeholder="Year of Passing"
            value={education.year}
            onChange={(e) => handleEducationChange(index, e)}
          />
          {errors[`year_${index}`] && <span className="error">{errors[`year_${index}`]}</span>}
          <input
            type="text"
            name="percentage"
            placeholder="Percentage/CGPA"
            value={education.percentage}
            onChange={(e) => handleEducationChange(index, e)}
          />
          {errors[`percentage_${index}`] && <span className="error">{errors[`percentage_${index}`]}</span>}
          <input
            type="file"
            name="marksheet"
            placeholder="Upload Marksheet"
            accept=".pdf"
            onChange={(e) => handleMarksheetFileChange(e, index)}
            className="custom-file-input"
          />
          {education.marksheet && education.marksheet.fileUrl && (
            <div>
              <a href={education.marksheet.fileUrl} target="_blank" rel="noopener noreferrer">
                {education.marksheet.file.name}
              </a>
            </div>
          )}
          {errors[`marksheet_${index}`] && <span className="error">{errors[`marksheet_${index}`]}</span>}
          {index > 0 && (
            <button type="button" onClick={() => removeEducationField(index)}>Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addEducationField}>Add Education</button>

      {/* Work Experience Details Section */}
      <h3>Work Experience Details:</h3>
      {formData.workExperienceDetails.map((experience, index) => (
        <div key={index}>
          <input
            type="text"
            name="post"
            placeholder="Post Held"
            value={experience.post}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`post_${index}`] && <span className="error">{errors[`post_${index}`]}</span>}
          <input
            type="text"
            name="company"
            placeholder="Company/Institute"
            value={experience.company}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`company_${index}`] && <span className="error">{errors[`company_${index}`]}</span>}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={experience.location}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`location_${index}`] && <span className="error">{errors[`location_${index}`]}</span>}
          <input
            type="text"
            name="from"
            placeholder="From"
            value={experience.from}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`from_${index}`] && <span className="error">{errors[`from_${index}`]}</span>}
          <input
            type="text"
            name="to"
            placeholder="To"
            value={experience.to}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`to_${index}`] && <span className="error">{errors[`to_${index}`]}</span>}
          <textarea
            name="duties"
            placeholder="Duties Performed"
            value={experience.duties}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`duties_${index}`] && <span className="error">{errors[`duties_${index}`]}</span>}
          {index > 0 && (
            <button type="button" onClick={() => removeExperienceField(index)}>Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addExperienceField}>Add Work Experience</button>
      <div>
      <br/>
        <button type="button" onClick={prevStep}>Previous</button>&nbsp;&nbsp;
        <button type="button" onClick={handleNextStep}>Next</button>
      </div>
    </form>
  );
}

export default Qualifications;
