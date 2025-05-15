const axios = require("axios");
require("dotenv").config();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const askGroq = async (question, rawData) => {
  const prompt = `
    You are a smart data analyst.

    You are given:
    - A user business question: "${question}"
    - Raw SQL result data (array of rows from a database):  
    ${JSON.stringify(rawData.slice(0, 15), null, 2)}

    Your job:
    1. Analyze and process this raw data to extract meaningful insights.
    2. Create a clean final table (2D array or list of objects) — do calculations like totals, averages, growth, etc. if required.
    3. Write a clear explanation of the insight.
    4. Suggest the best chart type (bar, pie, or line).

    Respond in **strict JSON** like this:

    {
      "explanation": "Total revenue by region shows that South leads with $1200, followed by North...",
      "chartType": "bar",
      "chartKeys": {
        "x": "region",
        "y": "average_revenue"
      },
      "table": [
        //the table should contains the required fields that are need to plot 
        { "col1": "row1", "col2", "row1" },
        ...
      ]
    }
`;

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    const jsonStart = reply.indexOf("{");
    const jsonEnd = reply.lastIndexOf("}");
    const rawJson = reply.slice(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(rawJson);
    return parsed;
  } catch (err) {
    console.error("🔥 Groq API ERROR:", err.response?.data || err.message);
    throw new Error("Groq API failed");
  }
};

module.exports = askGroq;
