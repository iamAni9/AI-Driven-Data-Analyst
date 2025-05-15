const axios = require("axios");
require("dotenv").config();

const refineCsvWithGroq = async (sampleRows) => {
  const prompt = `
    You are a data cleaning expert.

    You will receive a sample of raw CSV data as JSON array. Each object is a row with possibly dirty, inconsistent, or missing column names or values.

    1. Suggest cleaned column names.
    2. Clean each row appropriately (e.g., fix empty values, convert types, rename keys).
    3. Return the result in this format do not change the format:

    CleanedColumns:
    [col1, col2, col3, ...]

    CleanedRows:
    [
    { col1: ..., col2: ..., col3: ... },
    ...
    ]
    Here is the sample data:

    ${JSON.stringify(sampleRows.slice(0, 5), null, 2)}
    `;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "deepseek-r1-distill-llama-70b",
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

  return res.data.choices[0].message.content;
};

module.exports = refineCsvWithGroq;
