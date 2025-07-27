import React, { useState } from "react";
import axios from "axios";

const PatientSymptomForm = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    symptoms: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setResult("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");

    if (formData.symptoms.length < 10) {
      setError("Please provide more detailed symptoms.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/diagnosis/analyze", formData);
      setResult(res.data.result);
    } catch (err) {
      setError("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
          AI Symptom Checker
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="patientName"
            placeholder="Your Name"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            name="symptoms"
            placeholder="Describe your symptoms..."
            rows="4"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold ${
              loading
                ? "bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700 transition"
            }`}
          >
            {loading ? "Analyzing..." : "Get Diagnosis"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
            <h3 className="font-semibold mb-2">AI Result:</h3>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSymptomForm;
