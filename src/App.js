import React, { useState } from "react";
import Dropdown from "./components/Dropdown";
import axios from "axios";
import "./App.css";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(["All"]);
  const dropdownOptions = ["Numbers", "Alphabets", "Highest Lowercase Alphabet", "file_size", "file_type", "All"];

  const validateJSON = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateJSON(jsonInput)) {
      setError("Invalid JSON format");
      return;
    }
    setError("");
    try {
      const res = await axios.post(
        `https://bajaj-backend-7tq2.onrender.com/bfhl`,
        JSON.parse(jsonInput),
        { headers: { "Content-Type": "application/json" } }
      );
      setResponse(res.data);
    } catch (err) {
      console.error("Error calling backend API:", err);
      setError(err.response?.data?.message || "Error connecting to backend");
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    if (selectedOptions.includes("All")) {
      return (
        <div className="response-section">
          <h3>Filtered Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      );
    }

    const filteredResponse = {};
    if (selectedOptions.includes("Numbers")) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedOptions.includes("Alphabets")) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedOptions.includes("Highest Lowercase Alphabet")) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }
    if (selectedOptions.includes("file_size")) {
      filteredResponse.file_size = response.file_size_kb;
    }
    if (selectedOptions.includes("file_type")) {
      filteredResponse.file_type = response.file_mime_type;
    }

    return (
      <div className="response-section">
        <h3>Filtered Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>0101CS201086</h1>
      </div>
      <div className="input-section">
        <label htmlFor="json-input">API Input:</label>
        <textarea
          id="json-input"
          rows="5"
          placeholder='{"data":["M","1","334","4","B"]}'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        {error && <p className="error">{error}</p>}
      </div>
      <h2 className="text-center">Filters:</h2>
      {response && (
        <div className="dropdown-section">
          <Dropdown
            options={dropdownOptions}
            selectedOptions={selectedOptions}
            handleChange={setSelectedOptions}
          />
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
