/*App.js */
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [entries, setEntries] = useState([]); // Main column names
  const [selectedEntry, setSelectedEntry] = useState(''); // Selected column
  const [subFields, setSubFields] = useState([]); // Subfields for nested entries
  const [selectedSubfield, setSelectedSubfield] = useState(''); // Selected subfield
  const [constraintOptions, setConstraintOptions] = useState([]); // Options for constraints
  const [selectedConstraint, setSelectedConstraint] = useState(''); // Selected constraint value
  const [filters, setFilters] = useState([]); // Applied filters
  const [candidates, setCandidates] = useState([]); // Candidate data

  // List of fields to exclude from filter dropdown
  const filterExclusions = ['_id', '__v', 'motherName', 'fatherName', 'passportPhoto', 'phdDocuments', 'convictionDetails', 'enquiryDetails', 'plagiarismDetails', 'marksheet'];

  useEffect(() => {
    fetch('http://localhost:5001/api/getEntries')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEntries(data);
        } else {
          console.error('Expected entries to be an array, got:', data);
          setEntries([]);
        }
      })
      .catch((err) => console.error('Error fetching entries:', err));

    fetchCandidates();
  }, []);

  const fetchCandidates = () => {
    fetch('http://localhost:5001/api/getCandidates')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCandidates(data);
        } else {
          setCandidates([]);
          console.error('Expected candidates to be an array, got:', data);
        }
      })
      .catch((err) => {
        setCandidates([]);
        console.error('Error fetching candidates:', err);
      });
  };

  useEffect(() => {
    // Fetch subfields for nested fields
    if (selectedEntry) {
      switch (selectedEntry) {
        case 'educationDetails':
          setSubFields(['degree', 'board', 'year', 'percentage', 'marksheet']);
          break;
        case 'workExperienceDetails':
          setSubFields(['post', 'company', 'location', 'from', 'to', 'duties']);
          break;
        case 'publications':
          setSubFields(['title', 'journal']);
          break;
        default:
          setSubFields([]);
          fetchConstraintOptions(selectedEntry);
      }
    }
  }, [selectedEntry]);

  const fetchConstraintOptions = (entry, subfield = '') => {
    const query = subfield ? `${entry}.${subfield}` : entry;
    fetch(`http://localhost:5001/api/getConstraintOptions?entry=${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setConstraintOptions(data);
        } else {
          console.error('Expected constraint options to be an array, got:', data);
          setConstraintOptions([]);
        }
      })
      .catch((err) => console.error('Error fetching constraint options:', err));
  };

  const handleAddFilter = () => {
    if (selectedEntry && (selectedConstraint || (selectedEntry === 'percentage' || selectedSubfield === 'percentage'))) {
      let filter;
      if ((selectedEntry === 'percentage' || selectedSubfield === 'percentage') && (selectedConstraint === 'gt' || selectedConstraint === 'lt')) {
        filter = {
          entry: selectedSubfield ? `${selectedEntry}.${selectedSubfield}` : selectedEntry,
          constraint: selectedConstraint,
          value: constraintOptions[0]
        };
      } else {
        filter = {
          entry: selectedSubfield ? `${selectedEntry}.${selectedSubfield}` : selectedEntry,
          constraint: selectedConstraint,
        };
      }
      setFilters([...filters, filter]);
      resetFilterFields();
    }
  };

  const resetFilterFields = () => {
    setSelectedEntry('');
    setSelectedSubfield('');
    setSelectedConstraint('');
    setConstraintOptions([]);
  };

  useEffect(() => {
    if (filters.length > 0) {
      fetch('http://localhost:5001/api/filterCandidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCandidates(data);
          } else {
            setCandidates([]);
            console.error('Expected candidates to be an array, got:', data);
          }
        })
        .catch((err) => {
          setCandidates([]);
          console.error('Error applying filters:', err);
        });
    } else {
      fetchCandidates();
    }
  }, [filters]);

  const isValidDate = (value) => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  };

  // Utility function to capitalize the first letter of each word
  const capitalizeWords = (str) => {
    if (typeof str !== 'string') return str === undefined || str === null ? '' : String(str);
    return str
      .split(/(?=[A-Z])|_/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Utility function to format column names and nested field names
  const formatColumnName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\[(\d+)\]/g, ' $1') // Format array indices
      .replace(/\./g, ' ') // Replace dots with spaces
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  const handleDownloadExcel = () => {
    console.log('Download Excel button clicked'); // Debugging: Log button click
    fetch('http://localhost:5000/api/downloadExcel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters: [] }), // Send an empty filters array for all data
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            console.error('Error response from server:', error); // Debugging: Log server error
            throw new Error(error.error || 'Failed to download Excel file');
          });
        }
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'candidates.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        console.log('Excel file downloaded successfully'); // Debugging: Log success
      })
      .catch((err) => console.error('Error downloading Excel file:', err.message));
  };

  const handleDownloadFilteredExcel = () => {
    console.log('Filters being sent:', filters); // Debugging: Log the filters being sent
    fetch('http://localhost:5000/api/downloadExcel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters }), // Send filters in the request body
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            console.error('Error response from server:', error); // Debugging: Log server error
            throw new Error(error.error || 'Failed to download Excel file');
          });
        }
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filtered_candidates.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        console.log('Filtered Excel file downloaded successfully.'); // Debugging: Log success
      })
      .catch((err) => console.error('Error downloading Excel file:', err.message));
  };

  return (
    <div className="admin-page">
      <h1 className="welcome-header">Welcome, Admin! Ease the candidate shortlisting process</h1>

      <div className="filter-section">
        {/* Main Entry Selection */}
        <div>
          <label htmlFor="entry-select">Select Entry (Column Name): </label>
          <select
            id="entry-select"
            value={selectedEntry}
            onChange={(e) => {
              setSelectedEntry(e.target.value);
              setSelectedSubfield('');
              setConstraintOptions([]);
            }}
          >
            <option value="">-- Select --</option>
            {entries
              .filter((entry) => !filterExclusions.includes(entry))
              .map((entry, i) => (
                <option key={i} value={entry}>
                  {capitalizeWords(entry)}
                </option>
              ))}
          </select>
        </div>

        {/* Subfield Selection */}
        {subFields.length > 0 && (
          <div>
            <label htmlFor="subfield-select">Select Subfield: </label>
            <select
              id="subfield-select"
              value={selectedSubfield}
              onChange={(e) => {
                setSelectedSubfield(e.target.value);
                fetchConstraintOptions(selectedEntry, e.target.value);
              }}
            >
              <option value="">-- Select Subfield --</option>
              {subFields
                .filter((sub) => !filterExclusions.includes(sub))
                .map((sub, i) => (
                  <option key={i} value={sub}>
                    {capitalizeWords(sub)}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Constraint Selection */}
        {(selectedSubfield === 'percentage' || selectedEntry === 'percentage') ? (
          <div>
            <label htmlFor="constraint-select">Select Constraint: </label>
            <select
              id="constraint-select"
              value={selectedConstraint}
              onChange={(e) => setSelectedConstraint(e.target.value)}
            >
              <option value="">-- Select Constraint --</option>
              <option value="gt">Greater Than</option>
              <option value="lt">Less Than</option>
            </select>
            <input
              type="number"
              placeholder="Enter value"
              onChange={(e) => setConstraintOptions([e.target.value])}
              value={constraintOptions[0] || ''}
              style={{ marginLeft: '8px' }}
            />
          </div>
        ) : constraintOptions.length > 0 && (
          <div>
            <label htmlFor="constraint-select">Select Constraint: </label>
            <select
              id="constraint-select"
              value={selectedConstraint}
              onChange={(e) => setSelectedConstraint(e.target.value)}
            >
              <option value="">-- Select Constraint --</option>
              {constraintOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {capitalizeWords(opt)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add Filter Button */}
        <div>
          <button onClick={handleAddFilter}>Add Filter</button>
        </div>
      </div>

      <div className="applied-filters">
        {filters.map((filter, i) => (
          <div key={i}>
            {filter.entry}: {filter.constraint}
            <button onClick={() => setFilters(filters.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
        ))}
      </div>

      <div className="download-section">
        <button onClick={handleDownloadExcel}>Download Excel</button>
        <button onClick={handleDownloadFilteredExcel}>Download Filtered Excel</button>
      </div>

      <div className="candidate-table">
        <table>
          <thead>
            <tr>
              {entries.map((header, i) => (
                <th key={i}>{formatColumnName(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(candidates) ? candidates : []).map((candidate, i) => (
              <tr key={i}>
                {entries.map((field, j) => (
                  <td key={j}>
                    {Array.isArray(candidate[field])
                      ? candidate[field].map((item, idx) => (
                          <div key={idx}>
                            {typeof item === 'object'
                              ? Object.entries(item)
                                  .filter(([key]) => key !== 'id') // Exclude the 'id' field
                                  .map(([key, value]) => (
                                    <div key={key}>
                                      <strong>{formatColumnName(key)}:</strong> {value}
                                    </div>
                                  ))
                              : item}
                          </div>
                        ))
                      : typeof candidate[field] === 'object'
                      ? Object.entries(candidate[field])
                          .filter(([key]) => key !== 'id') // Exclude the 'id' field
                          .map(([key, value]) => (
                            <div key={key}>
                              <strong>{formatColumnName(key)}:</strong> {value}
                            </div>
                          ))
                      : isValidDate(candidate[field])
                      ? new Date(candidate[field]).toLocaleDateString()
                      : candidate[field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;

