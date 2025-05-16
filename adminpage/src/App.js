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

  useEffect(() => {
    fetch('http://localhost:5001/api/getEntries')
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch((err) => console.error('Error fetching entries:', err));

    fetchCandidates();
  }, []);

  const fetchCandidates = () => {
    fetch('http://localhost:5001/api/getCandidates')
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .catch((err) => console.error('Error fetching candidates:', err));
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
      .then((data) => setConstraintOptions(data))
      .catch((err) => console.error('Error fetching constraint options:', err));
  };

  const handleAddFilter = () => {
    if (selectedEntry && selectedConstraint) {
      const filter = {
        entry: selectedSubfield ? `${selectedEntry}.${selectedSubfield}` : selectedEntry,
        constraint: selectedConstraint,
      };
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
        .then((data) => setCandidates(data))
        .catch((err) => console.error('Error applying filters:', err));
    } else {
      fetchCandidates();
    }
  }, [filters]);

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
            {entries.map((entry, i) => (
              <option key={i} value={entry}>
                {entry}
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
              {subFields.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Constraint Selection */}
        {constraintOptions.length > 0 && (
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
                  {opt}
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

      {/* <div className="filter-section">
        <select
          value={selectedEntry}
          onChange={(e) => {
            setSelectedEntry(e.target.value);
            setSelectedSubfield('');
            setConstraintOptions([]);
          }}
        >
          <option value="">-- Select Entry --</option>
          {entries.map((entry, i) => (
            <option key={i} value={entry}>
              {entry}
            </option>
          ))}
        </select>

        {subFields.length > 0 && (
          <select
            value={selectedSubfield}
            onChange={(e) => {
              setSelectedSubfield(e.target.value);
              fetchConstraintOptions(selectedEntry, e.target.value);
            }}
          >
            <option value="">-- Select Subfield --</option>
            {subFields.map((sub, i) => (
              <option key={i} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

        {constraintOptions.length > 0 && (
          <select
            value={selectedConstraint}
            onChange={(e) => setSelectedConstraint(e.target.value)}
          >
            <option value="">-- Select Constraint --</option>
            {constraintOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
        <button onClick={handleAddFilter}>Add Filter</button>
      </div> */}

      <div className="applied-filters">
        {filters.map((filter, i) => (
          <div key={i}>
            {filter.entry}: {filter.constraint}
            <button onClick={() => setFilters(filters.filter((_, idx) => idx !== i))}>Remove</button>
          </div>
        ))}
      </div>

      <div className="candidate-table">
        <table>
          <thead>
            <tr>
              {entries.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, i) => (
              <tr key={i}>
                {entries.map((field, j) => (
                  <td key={j}>
                    {typeof candidate[field] === 'object'
                      ? JSON.stringify(candidate[field])
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

