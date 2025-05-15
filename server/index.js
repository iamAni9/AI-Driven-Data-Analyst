const express = require("express");
const cors = require("cors");
require("dotenv").config();

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Server is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const pool = require('./db');

app.get("/api/sales", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sales");
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err)
    res.status(500).send("Database error");
  }
});

const refineCsvWithGroq = require("./refineCsvWithGroq");

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const rows = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      fs.unlinkSync(filePath); // Clean up

      if (rows.length === 0) {
        return res.status(400).json({ message: "Empty CSV file." });
      }
     
      const rawGroqResponse = await refineCsvWithGroq(rows);
      console.log("Refined CSV data", rawGroqResponse);
      // Clean column names
      const cleanedColsMatch = rawGroqResponse.match(/CleanedColumns:\s*\[(.*?)\]/s);
      const cleanedRowsMatch = rawGroqResponse.match(/CleanedRows:\s*(\[[\s\S]*\])/);
      console.log("cleanedRows", cleanedRowsMatch);

      const cleanedColumns = cleanedColsMatch[1]
      .split(",")
      .map((col, i) => {
        const cleaned = col.replace(/["']/g, "").trim().replace(/\W+/g, "_").toLowerCase();
        return cleaned || `col_${i}`;
      });

      const cleanedRows = JSON.parse(cleanedRowsMatch[1]);
      const normalizedRows = cleanedRows.map(row => {
      const normalized = {};
      Object.keys(row).forEach(key => {
          normalized[key.trim().toLowerCase()] = row[key];
        });
        return normalized;
      });
      console.log("🧼 Cleaned Columns:", cleanedColumns);
      console.log("🧼 Cleaned Rows Sample:", normalizedRows.slice(0, 2));


      try {
        // Drop table if exists
        await pool.query("DROP TABLE IF EXISTS custom_data");

        // Create new table
        const createSQL = `
          CREATE TABLE custom_data (
            ${cleanedColumns.map(col => `${col} TEXT`).join(", ")}
          );
        `;
        console.log("🛠️ Creating table with:", createSQL);

        await pool.query(createSQL);

        // Insert rows
        for (const row of normalizedRows) {
          const values = cleanedColumns.map(col =>
            row[col] !== undefined ? row[col] : ""
          );
          await pool.query(
            `INSERT INTO custom_data (${cleanedColumns.join(", ")}) VALUES (${cleanedColumns.map((_, i) => `$${i + 1}`).join(", ")})`,
            values
          );
        }
        console.log("CSV uploaded and table created successfully.")

        res.json({ message: "CSV uploaded and table created successfully." });
      } catch (err) {
        console.error("❌ Upload error:", err);
        res.status(500).json({ message: "Failed to process CSV." });
      }
    });
});

const getTableSchema = require("./getTableSchema");
const getSQL = require("./getSQL");
const askGroq = require('./groqAgent');

app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }

  try {
    const tableInfo = await getTableSchema("custom_data");

    // Step 1: Get required column for SQL query
    const columns = await getSQL(question, tableInfo);
    if (!columns?.length) throw new Error("LLM returned no columns");

    
    // Step 2: Run SQL query
    const sqlQuery = `SELECT ${columns.join(", ")} FROM custom_data`;
    console.log("🧠 SQL:", sqlQuery);
    const result = await pool.query(sqlQuery);
    const rawData = result.rows;

    // Step 3: Analyze raw data with Groq to generate explanation + final table + chart type
    const { explanation, chartType, chartKeys, table } = await askGroq(question, rawData);

    console.log("📘 Explanation:", explanation);
    console.log("📊 Chart Type:", chartType);
    console.log("📊 Chart Keys:", chartKeys);
    console.log("📋 Final Table:", table);

    // Step 4: Return final output to frontend
    res.json({
      data: table,
      query: sqlQuery,
      explanation,
      chartType,
      chartKeys,
    });

  } catch (err) {
    console.error("🔥 ERROR:", err.message);
    res.status(500).json({ error: "Failed to process the question" });
  }
});


