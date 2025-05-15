import { useState, useRef } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import FileUploadForm from "./components/FileUploadForm";
import ChartRenderer from "./components/ChartRenderer";
import { FiArrowUpRight } from "react-icons/fi";

const App = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.length) return;

    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);

    setUploading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, formData);
      alert(`Upload successful: ${res.data.message}`);
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAnalyzing(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ask`, { question });
      setResponse({
        data: res.data.data,           
        explanation: res.data.explanation,
        chartType: res.data.chartType,
        chartKeys: res.data.chartKeys,
        query: res.data.query
      });
    } catch (err) {
      setResponse({ error: "Failed to fetch result. Please try again." });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Data Analysis Assistant
          </h1>
          <p className="text-gray-600">Ask questions and visualize your data insights</p>
        </header>

        <div className="space-y-10">
          <FileUploadForm loading={uploading} onUpload={handleFileUpload} fileInputRef={fileInputRef} />

          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a business question..."
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={analyzing}
              />
              <button
                onClick={askQuestion}
                disabled={analyzing}
                className="px-6 py-3 bg-blue-600 text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {analyzing ? <BeatLoader size={8} color="#fff" /> : (
                  <>
                    Analyze
                    <FiArrowUpRight className="text-lg" />
                  </>
                )}
              </button>
            </div>

            {response?.explanation && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">Insights</h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {response.explanation}
                </p>
              </div>
            )}
          </div>

          {response?.data?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Visualization</h3>
                <div className="border rounded-lg overflow-hidden">
                  <ChartRenderer data={response.data} chartType={response.chartType} chartKeys={response.chartKeys} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Raw Data</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(response.data[0]).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {response.data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-4 py-3 text-sm text-gray-700">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {response?.error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
              {response.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
