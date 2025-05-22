/*PersonalInfo.js*/
import React, { useState } from 'react';

function PersonalInfo({ formData, handleChange, handlePhotoChange, nextStep }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formValid = true;
    let errors = {};

    // Check if all fields are filled
    if (!formData.applicationFor) {
      formValid = false;
      errors.applicationFor = "Application you are applying for is required to be filled";
    }

    if (!formData.fullName) {
      formValid = false;
      errors.fullName = "Full Name is required";
    }
    else if (!/^[A-Z ]+$/.test(formData.fullName)) {
      formValid = false;
      errors.fullName = "Full Name must be in block letters";
    }

    if (!formData.photo) {
      formValid = false;
      errors.photo = "Passport size photo is required";
    } else if (formData.photo && formData.fullName) {
      const expectedFileName = `Photo_${formData.fullName.replace(/ /g, '_')}`;
      if (formData.photo && formData.photo.name && !formData.photo.name.startsWith(expectedFileName)) {
        formValid = false;
        errors.photo = `Please name the file correctly as Photo_${formData.fullName.replace(/ /g, '_')}`;
      }
    }

    if (!formData.fatherName) {
      formValid = false;
      errors.fatherName = "Father's Name is required";
    }

    if (!formData.motherName) {
      formValid = false;
      errors.motherName = "Mother's Name is required";
    }

    if (!formData.gender) {
      formValid = false;
      errors.gender = "Gender is required";
    }

    if (!formData.dateOfBirth) {
      formValid = false;
      errors.dateOfBirth = "Date of Birth is required";
    }

    if (!formData.email) {
      formValid = false;
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formValid = false;
      errors.email = "Enter a valid email address";
    }


    if (!formData.category) {
      formValid = false;
      errors.category = "Category is required";
    }

    if (!formData.address) {
      formValid = false;
      errors.address = "Address is required";
    }

    if (!formData.contactNumbers) {
      formValid = false;
      errors.contactNumbers = "Contact Number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumbers)) {
      formValid = false;
      errors.contactNumbers = "Contact Number must be exactly 10 digits";
    }

    setErrors(errors);
    return formValid;
  };

  const handlePhotoValidation = (event) => {
    const file = event.target.files[0];
    if (file && formData.fullName) {
      const expectedFileName = `Photo_${formData.fullName.replace(/ /g, '_')}`;
      const uploadedFileName = file.name.split('.')[0];
      if (uploadedFileName !== expectedFileName) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          photo: `Please name the file correctly as ${expectedFileName}`,
        }));
        handleChange({ target: { name: 'photo', value: null } });
        return;
      }
    }
    handlePhotoChange(event);
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <form>
      <h1>Personal Information</h1>
      <div>
        <label>Application For:</label>
        <select
          name="applicationFor"
          value={formData.applicationFor}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Research Associate">Research Associate</option>
          <option value="JRF(DRDO Fellowship)">JRF(DRDO Fellowship)</option>
          <option value="JRF(Own Fellowship)">JRF(Own Fellowship)</option>
        </select>
        {errors.applicationFor && <span className="error">{errors.applicationFor}</span>}
      </div>
      <div>
        <label>Full Name in BLOCK letters:</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <span className="error">{errors.fullName}</span>}
      </div>
      <div>
        <label>Upload Your Passport Size Photo:</label>
        <h4>** Note: Name of the image uploaded must be Photo_Your_full_name (e.g.Photo_Divisha_Bhardwaj)</h4>
        <input
          type="file"
          name="photo"
          accept="image/jpeg, image/png"
          onChange={handlePhotoValidation}
          className="custom-file-input"
        />
        {/* Display the photo preview if available */}
        {formData.photo && formData.photo.fileUrl && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <img
              src={formData.photo.fileUrl}
              alt="Uploaded Passport Size "
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '1px solid #ccc', borderRadius: '5px' }}
            />
            <br />
            <button
              type="button"
              onClick={() => handleChange({ target: { name: 'photo', value: null } })}
              style={{
                marginTop: '5px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              Remove Photo
            </button>
          </div>
        )}
        {errors.photo && <span className="error">{errors.photo}</span>}
      </div>
      <div>
        <label>Father's Name:</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
        />
        {errors.fatherName && <span className="error">{errors.fatherName}</span>}
      </div>
      <div>
        <label>Mother's Name:</label>
        <input
          type="text"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
        />
        {errors.motherName && <span className="error">{errors.motherName}</span>}
      </div>
      <div>
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>
      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
        {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <label>Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="General">General</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
          <option value="EWS">EWS</option>
        </select>
        {errors.category && <span className="error">{errors.category}</span>}
      </div>
      <div>
        <label>Address:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
        ></textarea>
        {errors.address && <span className="error">{errors.address}</span>}
      </div>
      <div>
        <label>Contact Numbers:</label>
        <input
          type="text"
          name="contactNumbers"
          value={formData.contactNumbers}
          onChange={handleChange}
        />
        {errors.contactNumbers && (
          <span className="error">{errors.contactNumbers}</span>
        )}
      </div>
      <button type="button" onClick={handleNext}>Next</button>
    </form>
  );
}

export default PersonalInfo;

