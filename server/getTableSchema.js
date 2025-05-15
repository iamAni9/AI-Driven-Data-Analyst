const pool = require("./db");

const getTableSchema = async (tableName = "custom_data") => {
  const result = await pool.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = $1
  `, [tableName]);

  return result.rows.map(col => `${col.column_name} (${col.data_type})`).join(", ");
};

module.exports = getTableSchema;
