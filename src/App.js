import React, { useState } from "react";
import axios from "axios";

function App() {
  const [emailText, setEmailText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const checkSpam = async () => {
    if (!emailText.trim()) {
      alert("Please enter email text!");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        "https://spam-detector-api-apiverve.p.rapidapi.com/v1/spamdetector",
        {
          text: emailText,
          email: "test@example.com", // optional
          ip: "122.180.184.182", // optional
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY, 
            "X-RapidAPI-Host": "spam-detector-api-apiverve.p.rapidapi.com",
          },
        }
      );

      console.log("API Response:", response.data);

      const isSpam = response.data?.data?.likelySpam ?? false;

      setResult({
        isSpam,
        suggestions: isSpam
          ? [
              "Avoid spammy keywords like FREE, WIN, CASH.",
              "Don’t use too many exclamation marks.",
              "Keep sentences concise and professional.",
            ]
          : ["✅ Looks good! Keep your message clean and professional."],
      });
    } catch (error) {
      console.error(error);
      alert("Error checking spam! See console.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1>📧 Spam Checker</h1>
      <textarea
        rows="8"
        cols="50"
        placeholder="Paste your email text here..."
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "80%",
          maxWidth: "500px",
        }}
      ></textarea>
      <br />
      <button
        onClick={checkSpam}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Checking..." : "Check Spam"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            maxWidth: "500px",
            margin: "20px auto",
          }}
        >
          <h2>Result</h2>
          <p>
            <strong>Status:</strong>{" "}
            {result.isSpam ? "🚨 Spam Detected" : "✅ Not Spam"}
          </p>
          <h3>Suggestions:</h3>
          <ul style={{ textAlign: "left" }}>
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
