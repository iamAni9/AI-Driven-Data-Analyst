// server/generateSQLAgent.js
const axios = require("axios");
require("dotenv").config();

const generateSQLAgent = async (question, tableSchema) => {
  const prompt = `
    You are a data analyst.

    Given this question:
    "${question}"

    And this table schema:
    ${tableSchema}

    Return ONLY the minimal list of column names from the schema that are required to answer the question.

    Respond in this JSON format:

    {
    "columns": ["column1", "column2", ...]
    }
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "deepseek-r1-distill-llama-70b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const content = response.data.choices[0].message.content;
  const jsonStart = content.indexOf("{");
  const jsonEnd = content.lastIndexOf("}");
  const cleaned = content.slice(jsonStart, jsonEnd + 1);

  const parsed = JSON.parse(cleaned);
  return parsed.columns;
};

module.exports = generateSQLAgent;
