"use client";

import { useState } from 'react';
import '../styles/Enigma.css';

export default function Enigma() {
  const [rotors, setRotors] = useState(["I", "II", "III"]);
  const [rotorPositions, setRotorPositions] = useState([0, 0, 0]);
  const [ringSettings, setRingSettings] = useState([1, 1, 1]);
  const [plugboard, setPlugboard] = useState({});
  const [reflector, setReflector] = useState("B");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const handleRotorChange = (index, value) => {
    const newRotors = [...rotors];
    newRotors[index] = value;
    setRotors(newRotors);
  };

  const handleRotorPositionChange = (index, value) => {
    const newPositions = [...rotorPositions];
    newPositions[index] = value;
    setRotorPositions(newPositions);
  };

  const handleRingSettingChange = (index, value) => {
    const newSettings = [...ringSettings];
    newSettings[index] = value;
    setRingSettings(newSettings);
  };

  const handlePlugboardChange = (letter, connection) => {
    setPlugboard({
      ...plugboard,
      [letter]: connection,
    });
  };

  const handleReflectorChange = (value) => {
    setReflector(value);
  };

  const handleEncryptDecrypt = async (mode) => {
    try {
      const response = await fetch('/api/enigma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          message,
          rotors,
          rotorPositions,
          ringSettings,
          plugboard,
          reflector,
        }),
      });
  
      // Check if the response is ok (status code in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Attempt to parse the response as JSON
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Error during encryption/decryption:", error);
      setResult("An error occurred. Please check your input and try again.");
    }
  };
  

  return (
    <div className="enigma-container">
      <h1 className="title">Enigma Machine Simulator</h1>

      <div className="settings">
        <h2>Rotor Settings</h2>
        {rotors.map((rotor, index) => (
          <div key={index}>
            <label>Rotor {index + 1}</label>
            <select onChange={(e) => handleRotorChange(index, e.target.value)} value={rotor}>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              {/* Add more rotor options as needed */}
            </select>
            <input
              type="number"
              min="0"
              max="25"
              value={rotorPositions[index]}
              onChange={(e) => handleRotorPositionChange(index, parseInt(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="settings">
        <h2>Ring Settings</h2>
        {ringSettings.map((setting, index) => (
          <div key={index}>
            <label>Ring Setting {index + 1}</label>
            <input
              type="number"
              min="1"
              max="26"
              value={setting}
              onChange={(e) => handleRingSettingChange(index, parseInt(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="settings">
        <h2>Plugboard Settings</h2>
        {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
          <div key={letter}>
            <label>{letter}</label>
            <input
              type="text"
              maxLength="1"
              value={plugboard[letter] || ""}
              onChange={(e) => handlePlugboardChange(letter, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="settings">
        <h2>Reflector</h2>
        <select onChange={(e) => handleReflectorChange(e.target.value)} value={reflector}>
          <option value="B">Reflector B</option>
          <option value="C">Reflector C</option>
          {/* Add more reflectors if needed */}
        </select>
      </div>

      <div className="message">
        <h2>Message</h2>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <div className="actions">
        <button onClick={() => handleEncryptDecrypt('encode')}>Encode</button>
        <button onClick={() => handleEncryptDecrypt('decode')}>Decode</button>
      </div>

      <div className="result">
        <h2>Result</h2>
        <p>{result}</p>
      </div>
    </div>
  );
}
