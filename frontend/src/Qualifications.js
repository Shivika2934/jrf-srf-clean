/* Qualifications.js */

import React, { useState } from 'react';
const currentYear = new Date().getFullYear();
const minYear = currentYear - 100;
const maxYear = currentYear + 10;
const validMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
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
  prevStep,
  testQualified // <-- add this prop
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
    } else if (
      formData.yearOfQualifying < minYear ||
      formData.yearOfQualifying > currentYear
    ) {
      formValid = false;
      errors.yearOfQualifying = `Year of qualifying must be between ${minYear} and ${currentYear}`;
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
        errors[`degree_${index}`] = `Degree is required `;
      }
      if (!education.board) {
        formValid = false;
        errors[`board_${index}`] = `Board/University is required `;
      }
      if (!education.year) {
        formValid = false;
        errors[`year_${index}`] = `Year of Passing is required `;
      } else if (education.year < minYear || education.year > maxYear) {
        formValid = false;
        errors[`year_${index}`] = `Year of Passing  must be between ${minYear} and ${maxYear}`;
      }
      if (education.percentage === undefined || education.percentage === null || education.percentage === '') {
        formValid = false;
        errors[`percentage_${index}`] = `Percentage/CGPA is required`;
      } else if (isNaN(education.percentage)) {
        formValid = false;
        errors[`percentage_${index}`] = `Percentage/CGPA must be a number`;
      } else {
        const value = parseFloat(education.percentage);
        if (value < 0 || value > 100) {
          formValid = false;
          errors[`percentage_${index}`] = `Percentage/CGPA must be between 0 and 100`;
        }
      }
      if (!education.marksheet) {
        formValid = false;
        errors[`marksheet_${index}`] = `Marksheet is required `;
      }
    });

    // Validate work experience details
    formData.workExperienceDetails.forEach((experience, index) => {
      if (!experience.post) {
        formValid = false;
        errors[`post_${index}`] = `Post Held is required `;
      }
      if (!experience.company) {
        formValid = false;
        errors[`company_${index}`] = `Company/Institute is required `;
      }
      if (!experience.location) {
        formValid = false;
        errors[`location_${index}`] = `Location is required `;
      }
      if (!experience.domain) {
        formValid = false;
        errors[`domain_${index}`] = `Internship domain is required `;
      }
      if (!experience.fromYear) {
        formValid = false;
        errors[`fromYear_${index}`] = `From Year is required`;
      } else {
        const fromYear = new Date(experience.fromYear).getFullYear();
        if (isNaN(fromYear) || fromYear < minYear || fromYear > maxYear) {
          formValid = false;
          errors[`fromYear_${index}`] = `From year must be between ${minYear} and ${maxYear}`;
        }
      }
      if (!experience.fromMonth) {
        formValid = false;
        errors[`fromMonth_${index}`] = `From Month is required`;
      } else if (!validMonths.includes(experience.fromMonth)) {
        formValid = false;
        errors[`fromMonth_${index}`] = `From Month must be between Jan and Dec`;
      }

      // Check To Month
      if (!experience.toMonth) {
        formValid = false;
        errors[`toMonth_${index}`] = `To Month is required`;
      } else if (!validMonths.includes(experience.toMonth)) {
        formValid = false;
        errors[`toMonth_${index}`] = `To Month must be between Jan and Dec`;
      }
      // Check To Year
      if (!experience.toYear) {
        formValid = false;
        errors[`toYear_${index}`] = `To Year is required`;
      } else {
        const toYear = new Date(experience.toYear).getFullYear(); // Corrected here
        if (isNaN(toYear) || toYear < minYear || toYear > maxYear) {
          formValid = false;
          errors[`toYear_${index}`] = `To year must be between ${minYear} and ${maxYear}`;
        }
      }

      if (!experience.duties) {
        formValid = false;
        errors[`duties_${index}`] = `Duties Performed are required `;
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
      {/* Conditionally show year of qualifying based on testQualified */}
      {(formData.testQualified === "Both NET & GATE" ||
        formData.testQualified === "NET (Fellowship)" ||
        formData.testQualified === "NET (Lectureship)" ||
        formData.testQualified === "GATE") && (
          <div>
            <label>
              {formData.testQualified === "GATE"
                ? "What is the year of qualifying GATE?"
                : formData.testQualified === "NET (Lectureship)" || formData.testQualified === "NET (Fellowship)"
                  ? "What is the year of qualifying NET?"
                  : "What is the year of qualifying NET/GATE?"}
            </label>
            <input
              type="number"
              name="yearOfQualifying"
              value={formData.yearOfQualifying}
              onChange={handleChange}
              min="2005"
              max={new Date().getFullYear()}
            />
            {errors.yearOfQualifying && <span className="error">{errors.yearOfQualifying}</span>}
          </div>
        )}
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
            name="domain"
            placeholder="Domain of Internship"
            value={experience.domain}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`domain_${index}`] && <span className="error">{errors[`domain_${index}`]}</span>}
          <input
            type="text"
            name="fromYear"
            placeholder="From Year"
            value={experience.fromYear}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`fromYear_${index}`] && <span className="error">{errors[`fromYear_${index}`]}</span>}
          <input
            type="text"
            name="fromMonth"
            placeholder="From Month (e.g., Jan)"
            value={experience.fromMonth}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`fromMonth_${index}`] && (
            <span className="error">{errors[`fromMonth_${index}`]}</span>
          )}
          <input
            type="text"
            name="toYear"
            placeholder="To Year"
            value={experience.toYear}
            onChange={(e) => handleExperienceChange(index, e)}
          />

          {errors[`toYear_${index}`] && <span className="error">{errors[`toYear_${index}`]}</span>}
          <input
            type="text"
            name="toMonth"
            placeholder="To Month (e.g., Dec)"
            value={experience.toMonth}
            onChange={(e) => handleExperienceChange(index, e)}
          />
          {errors[`toMonth_${index}`] && (
            <span className="error">{errors[`toMonth_${index}`]}</span>
          )}
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
        <br />
        <button type="button" onClick={prevStep}>Previous</button>&nbsp;&nbsp;
        <button type="button" onClick={handleNextStep}>Next</button>
      </div>
    </form>
  );
}

export default Qualifications;
