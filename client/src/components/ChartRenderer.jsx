import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from "recharts";

const COLORS = ["#3182ce", "#63b3ed", "#4299e1", "#90cdf4", "#bee3f8"];

const ChartRenderer = ({ data, chartType, chartKeys }) => {
  if (!data || data.length === 0 || !chartKeys?.x || !chartKeys?.y) {
    return <p className="text-sm text-red-600">Chart could not be rendered — missing keys or data.</p>;
  }

  const xKey = chartKeys.x;
  const yKey = chartKeys.y;

  // Validate keys
  const keysExist = data.every(row => row.hasOwnProperty(xKey) && row.hasOwnProperty(yKey));
  if (!keysExist) {
    console.warn("🚫 One or more rows missing x/y keys:", xKey, yKey);
    return <p className="text-sm text-red-600">Chart keys not found in one or more rows.</p>;
  }

  // Normalize data
  const chartData = data.map(row => ({
    [xKey]: row[xKey],
    [yKey]: typeof row[yKey] === "string" ? parseFloat(row[yKey].replace(/%/g, "")) : row[yKey]
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      {chartType === "pie" ? (
        <PieChart>
          <Pie
            data={chartData}
            dataKey={yKey}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ [xKey]: name, [yKey]: value }) => `${name}: ${value}%`}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      ) : chartType === "line" ? (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#3182ce"
            strokeWidth={2}
            dot={{ fill: "#3182ce" }}
          />
        </LineChart>
      ) : (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#3182ce" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default ChartRenderer;
