"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  FileType,
  Search,
  Upload,
  Database,
  MessageSquare,
  Settings,
  Globe,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

type DocumentItem = {
  file_name: string;
  type: string;
  chunks: number;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [documentCount, setDocumentCount] = useState(0);
  const [chunkCount, setChunkCount] = useState(0);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const [documentsResponse, statsResponse] =
        await Promise.all([
          fetch(`${API_URL}/documents`),
          fetch(`${API_URL}/documents/stats`),
        ]);

      if (!documentsResponse.ok) {
        throw new Error(
          "Failed to fetch documents."
        );
      }

      if (!statsResponse.ok) {
        throw new Error(
          "Failed to fetch document statistics."
        );
      }

      const documentsData =
        await documentsResponse.json();

      const statsData =
        await statsResponse.json();

      setDocuments(
        documentsData.documents || []
      );

      setDocumentCount(
        Number(statsData.documents || 0)
      );

      setChunkCount(
        Number(statsData.chunks || 0)
      );
    } catch (error) {
      console.error(
        "DOCUMENTS ERROR:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Something went wrong while loading documents."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
  fileName: string
) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${fileName}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/documents/${encodeURIComponent(
        fileName
      )}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          "Failed to delete document."
      );
    }

    await loadDocuments();

  } catch (error) {
    console.error(
      "DELETE ERROR:",
      error
    );

    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert(
        "Something went wrong while deleting the document."
      );
    }
  }
};

  const filteredDocuments =
    documents.filter((document) =>
      document.file_name
        .toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        )
    );

  const getFileIcon = (type: string) => {
    if (type === "pdf") {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
          <FileText
            size={20}
            className="text-red-500"
          />
        </div>
      );
    }

    if (type === "docx") {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <FileType
            size={20}
            className="text-blue-500"
          />
        </div>
      );
    }

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
        <FileText
          size={20}
          className="text-slate-500"
        />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">

        {/* LOGO */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b1c30]">
            <Sparkles
              size={18}
              className="text-white"
            />
          </div>

          <div>
            <p className="text-sm font-semibold">
              AI Knowledge
            </p>

            <p className="text-xs text-slate-400">
              Assistant
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">

            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-[#0b1c30]"
            >
              <BookOpen size={18} />
              Overview
            </Link>

            <Link
              href="/chat"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-[#0b1c30]"
            >
              <MessageSquare size={18} />
              Chat
            </Link>

            <Link
              href="/documents"
              className="flex items-center gap-3 rounded-xl bg-[#eef2ff] px-3 py-2.5 text-sm font-medium text-[#4338ca]"
            >
              <Database size={18} />
              Documents
            </Link>

            <button
              onClick={() =>
                alert(
                  "Website ingestion will be connected next."
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-[#0b1c30]"
            >
              <Globe size={18} />
              Websites
            </button>

          </nav>

          <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <nav className="space-y-1">

            <Link
              href="/chat"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-[#0b1c30]"
            >
              <MessageSquare size={18} />
              Chat History
            </Link>

            <button
              onClick={() =>
                alert(
                  "Settings will be added next."
                )
              }
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-[#0b1c30]"
            >
              <Settings size={18} />
              Settings
            </button>

          </nav>
        </div>

        {/* USER */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1c30] text-xs font-semibold text-white">
              KP
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                Kumar
              </p>

              <p className="text-xs text-slate-400">
                Free account
              </p>
            </div>

          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:ml-64">

        {/* TOP BAR */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur md:px-10">

          <div className="flex items-center gap-3">

            <Link
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
            </Link>

            <div>
              <p className="text-xs text-slate-400">
                Workspace / Documents
              </p>

              <h1 className="text-lg font-semibold">
                Documents
              </h1>
            </div>

          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-[#0b1c30] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#132b46]"
          >
            <Upload size={16} />
            Add Document
          </Link>

        </header>

        {/* CONTENT */}
        <section className="mx-auto max-w-6xl px-6 py-10 md:px-10">

          {/* HEADER */}
          <div className="mb-8">

            <h2 className="text-2xl font-semibold tracking-tight">
              Knowledge Base
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the documents your AI assistant uses
              to answer questions.
            </p>

          </div>

          {/* STATS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <Database
                    size={19}
                    className="text-indigo-500"
                  />
                </div>

              </div>

              <p className="text-2xl font-semibold">
                {documentCount}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Documents
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <BookOpen
                    size={19}
                    className="text-emerald-500"
                  />
                </div>

              </div>

              <p className="text-2xl font-semibold">
                {chunkCount}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Knowledge Chunks
              </p>

            </div>

          </div>

          {/* SEARCH */}
          <div className="mb-5 flex items-center gap-3">

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* DOCUMENT LIST */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

            {/* TABLE HEADER */}
            <div className="hidden grid-cols-[1fr_140px_140px_50px] items-center border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 md:grid">

              <span>Document</span>
              <span>Type</span>
              <span>Chunks</span>
              <span></span>

            </div>

            {loading ? (

              <div className="px-6 py-16 text-center">

                <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#4338ca]" />

                <p className="text-sm text-slate-500">
                  Loading documents...
                </p>

              </div>

            ) : filteredDocuments.length === 0 ? (

              <div className="px-6 py-16 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <FileText
                    size={24}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="text-sm font-semibold">
                  {searchQuery
                    ? "No documents found"
                    : "No documents yet"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  {searchQuery
                    ? "Try searching with a different document name."
                    : "Upload a document from the dashboard to start building your knowledge base."}
                </p>

                {!searchQuery && (
                  <Link
                    href="/dashboard"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b1c30] px-4 py-2.5 text-sm font-medium text-white"
                  >
                    <Upload size={16} />
                    Upload Document
                  </Link>
                )}

              </div>

            ) : (

              <div>

                {filteredDocuments.map(
                  (document, index) => (

                    <div
                      key={document.file_name}
                      className={`grid gap-4 px-6 py-5 transition hover:bg-slate-50 md:grid-cols-[1fr_140px_140px_50px] md:items-center ${
                        index !==
                        filteredDocuments.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >

                      {/* DOCUMENT */}
                      <div className="flex min-w-0 items-center gap-4">

                        {getFileIcon(
                          document.type
                        )}

                        <div className="min-w-0">

                          <p className="truncate text-sm font-medium text-[#0b1c30]">
                            {document.file_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Added to knowledge base
                          </p>

                        </div>

                      </div>

                      {/* TYPE */}
                      <div className="text-sm uppercase text-slate-500">
                        {document.type}
                      </div>

                      {/* CHUNKS */}
                      <div>

                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {document.chunks} chunks
                        </span>

                      </div>

                      {/* MENU */}
                      <button
                        onClick={() =>
                          handleDelete(document.file_name)
                        }
                        className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 md:flex"
                        title="Delete document"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

      </div>

    </main>
  );
}