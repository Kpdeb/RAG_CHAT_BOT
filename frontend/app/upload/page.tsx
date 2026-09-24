"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    setMessage("");
    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".docx",
      ".txt",
      ".md",
      ".csv",
    ];

    const fileName = selectedFile.name.toLowerCase();

    const isAllowed = allowedExtensions.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isAllowed) {
      setFile(null);
      setError(
        "Unsupported file type. Please upload PDF, DOCX, TXT, MD, or CSV."
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a document first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Upload failed."
        );
      }

      setMessage(
        `Successfully uploaded ${data.filename}. ${data.chunks_added} chunks added to the knowledge base.`
      );

      setFile(null);

      // Reset file input
      const input = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;

      if (input) {
        input.value = "";
      }
    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while uploading the document.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            AI KNOWLEDGE ASSISTANT
          </p>

          <h1 className="text-4xl font-bold">
            Upload Document
          </h1>

          <p className="text-gray-400 mt-3">
            Add documents to your knowledge base and ask
            questions about them using AI.
          </p>
        </div>

        {/* Upload Card */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-[#0b0b0b]">

          {/* File Input */}
          <label
            htmlFor="file-upload"
            className="block cursor-pointer"
          >
            <div className="border-2 border-dashed border-gray-700 hover:border-gray-500 rounded-xl p-10 text-center transition">

              <div className="text-5xl mb-4">
                📄
              </div>

              <h2 className="text-lg font-semibold">
                Choose a document
              </h2>

              <p className="text-gray-500 mt-2 text-sm">
                PDF, DOCX, TXT, MD or CSV
              </p>

              {file && (
                <div className="mt-5">
                  <p className="text-white font-medium">
                    {file.name}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </label>

          <input
            id="file-upload"
            type="file"
            accept=".pdf,.docx,.txt,.md,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full mt-6 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>

          {/* Success Message */}
          {message && (
            <div className="mt-5 border border-green-800 bg-green-950/30 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                ✓ {message}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-5 border border-red-800 bg-red-950/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">
                ✕ {error}
              </p>
            </div>
          )}
        </div>

        {/* Supported formats */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Supported formats: PDF • DOCX • TXT • MD • CSV
          </p>
        </div>

      </div>
    </main>
  );
}