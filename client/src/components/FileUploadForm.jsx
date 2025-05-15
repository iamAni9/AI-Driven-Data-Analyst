import { useState } from "react";
import { FiUpload } from "react-icons/fi";

const FileUploadForm = ({ loading, onUpload, fileInputRef }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  }
  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-800">Dataset Upload</h2>
          <p className="text-sm text-gray-500">Upload your CSV file for analysis</p>
        </div>

        <form onSubmit={onUpload} className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              accept=".csv"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex-1 cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
            >
              <FiUpload className="text-gray-400" />
              <span className="text-gray-600">
                <span className="text-gray-600">{fileName || "Choose a file..."}</span>
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadForm;
