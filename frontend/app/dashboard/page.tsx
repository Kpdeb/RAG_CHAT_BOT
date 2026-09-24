"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  BookOpen,
  Database,
  FileText,
  Globe,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Upload,
  ArrowUpRight,
  Clock3,
  MoreHorizontal,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export default function DashboardPage() {
  const [activeSection, setActiveSection] =
    useState("Overview");

  // ================================
  // DOCUMENT UPLOAD STATE
  // ================================

  const [uploading, setUploading] =
    useState(false);

  const [uploadMessage, setUploadMessage] =
    useState("");

  const [uploadError, setUploadError] =
    useState("");

  // ================================
  // WEBSITE STATE
  // ================================

  const [websiteUrl, setWebsiteUrl] =
    useState("");

  const [showWebsiteInput, setShowWebsiteInput] =
    useState(false);

  const [websiteUploading, setWebsiteUploading] =
    useState(false);

  const [websiteMessage, setWebsiteMessage] =
    useState("");

  const [websiteError, setWebsiteError] =
    useState("");

  // ================================
  // KNOWLEDGE BASE STATS
  // ================================

  const [documentCount, setDocumentCount] =
    useState(0);

  const [chunkCount, setChunkCount] =
    useState(0);

  const [websiteCount, setWebsiteCount] =
    useState(0);

  // ================================
  // RECENT ACTIVITY
  // ================================

  const [activities, setActivities] =
    useState<
      {
        type: string;
        message: string;
        details: string;
        timestamp: string;
      }[]
    >([]);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // ================================
  // LOAD KNOWLEDGE BASE STATS
  // ================================

  const loadStats = async () => {
    try {
      const response = await fetch(
        `${API_URL}/documents/stats`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch document statistics."
        );
      }

      const data =
        await response.json();

      setChunkCount(
        Number(data.chunks || 0)
      );

      // --------------------------------
      // Load documents separately so we
      // can distinguish websites
      // --------------------------------

      const documentsResponse =
        await fetch(
          `${API_URL}/documents`
        );

      if (documentsResponse.ok) {
        const documentsData =
          await documentsResponse.json();

        const documents =
          documentsData.documents || [];

        const websites =
          documents.filter(
            (doc: {
              type?: string;
            }) =>
              doc.type === "website"
          );

        const normalDocuments =
          documents.filter(
            (doc: {
              type?: string;
            }) =>
              doc.type !== "website"
          );

        setWebsiteCount(
          websites.length
        );

        setDocumentCount(
          normalDocuments.length
        );
      } else {
        // Fallback
        setDocumentCount(
          Number(data.documents || 0)
        );
      }
    } catch (error) {
      console.error(
        "STATS ERROR:",
        error
      );
    }
  };

  // ================================
  // LOAD RECENT ACTIVITY
  // ================================

  const loadActivities = async () => {
    try {
      const response = await fetch(
        `${API_URL}/activity`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch recent activity."
        );
      }

      const data =
        await response.json();

      setActivities(
        data.activities || []
      );
    } catch (error) {
      console.error(
        "ACTIVITY ERROR:",
        error
      );
    }
  };

  // ================================
  // INITIAL LOAD
  // ================================

  useEffect(() => {
    loadStats();
    loadActivities();
  }, []);

  // ================================
  // DOCUMENT UPLOAD
  // ================================

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setUploadMessage("");
    setUploadError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `${API_URL}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "Document upload failed."
        );
      }

      // Refresh stats
      await loadStats();

      // Success message
      setUploadMessage(
        `${data.filename} uploaded successfully. ${data.chunks_added} chunks added to the knowledge base.`
      );

      // Refresh activity
      await loadActivities();
    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

      if (
        error instanceof Error
      ) {
        setUploadError(
          error.message
        );
      } else {
        setUploadError(
          "Something went wrong while uploading the document."
        );
      }
    } finally {
      setUploading(false);

      // Allows same file to be selected again
      event.target.value = "";
    }
  };

  // ================================
  // OPEN FILE PICKER
  // ================================

  const openFilePicker = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  // ================================
  // OPEN WEBSITE INPUT
  // ================================

  const openWebsiteInput = () => {
    setShowWebsiteInput(true);

    setWebsiteMessage("");
    setWebsiteError("");
  };

  // ================================
  // CLOSE WEBSITE INPUT
  // ================================

  const closeWebsiteInput = () => {
    if (websiteUploading) {
      return;
    }

    setShowWebsiteInput(false);
    setWebsiteUrl("");
    setWebsiteMessage("");
    setWebsiteError("");
  };

  // ================================
  // ADD WEBSITE
  // ================================

  const handleWebsiteUpload = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanUrl =
      websiteUrl.trim();

    if (!cleanUrl) {
      setWebsiteError(
        "Please enter a website URL."
      );

      setWebsiteMessage("");

      return;
    }

    setWebsiteUploading(true);
    setWebsiteMessage("");
    setWebsiteError("");

    try {
      const response =
        await fetch(
          `${API_URL}/websites`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              url: cleanUrl,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Website upload failed."
        );
      }

      // --------------------------------
      // Refresh dashboard stats
      // --------------------------------

      await loadStats();

      // --------------------------------
      // Refresh recent activity
      // --------------------------------

      await loadActivities();

      // --------------------------------
      // Success
      // --------------------------------

      setWebsiteMessage(
        data.message ||
          `Website added successfully. ${
            data.chunks_added || 0
          } chunks added.`
      );

      // Clear URL
      setWebsiteUrl("");
    } catch (error) {
      console.error(
        "WEBSITE UPLOAD ERROR:",
        error
      );

      if (
        error instanceof Error
      ) {
        setWebsiteError(
          error.message
        );
      } else {
        setWebsiteError(
          "Something went wrong while adding the website."
        );
      }
    } finally {
      setWebsiteUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-[#e4e5ee] bg-white lg:flex lg:flex-col">

        {/* Logo */}

        <div className="flex h-16 items-center border-b border-[#e4e5ee] px-5">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4338ca] text-white">
              <BookOpen size={18} />
            </div>

            <span className="text-sm font-bold">
              AI Knowledge
            </span>
          </Link>

        </div>

        {/* Navigation */}

        <nav className="flex-1 px-3 py-5">

          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#9997a7]">
            Workspace
          </p>

          <div className="mt-3 space-y-1">

            <SidebarItem
              icon={
                <BookOpen size={18} />
              }
              label="Overview"
              active={
                activeSection ===
                "Overview"
              }
              onClick={() =>
                setActiveSection(
                  "Overview"
                )
              }
            />

            <SidebarItem
              icon={
                <MessageSquare size={18} />
              }
              label="Chat"
              active={
                activeSection ===
                "Chat"
              }
              onClick={() =>
                setActiveSection(
                  "Chat"
                )
              }
              href="/chat"
            />

            <SidebarItem
              icon={
                <FileText size={18} />
              }
              label="Documents"
              active={
                activeSection ===
                "Documents"
              }
              onClick={() =>
                setActiveSection(
                  "Documents"
                )
              }
              href="/documents"
            />

            <SidebarItem
              icon={
                <Globe size={18} />
              }
              label="Websites"
              active={
                activeSection ===
                "Websites"
              }
              onClick={() =>
                setActiveSection(
                  "Websites"
                )
              }
              href="/websites"
            />

          </div>

          <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-widest text-[#9997a7]">
            Account
          </p>

          <div className="mt-3 space-y-1">

            <SidebarItem
              icon={
                <Clock3 size={18} />
              }
              label="Chat History"
              active={
                activeSection ===
                "Chat History"
              }
              onClick={() =>
                setActiveSection(
                  "Chat History"
                )
              }
            />

            <SidebarItem
              icon={
                <Settings size={18} />
              }
              label="Settings"
              active={
                activeSection ===
                "Settings"
              }
              onClick={() =>
                setActiveSection(
                  "Settings"
                )
              }
            />

          </div>

        </nav>

        {/* Knowledge status */}

        <div className="border-t border-[#e4e5ee] p-4">

          <div className="rounded-xl bg-[#eff4ff] p-3">

            <div className="flex items-center justify-between">

              <span className="text-xs font-semibold">
                Knowledge Base
              </span>

              <span className="h-2 w-2 rounded-full bg-green-500" />

            </div>

            <p className="mt-1 text-[11px] text-[#777586]">
              Everything is ready
            </p>

          </div>

        </div>

        {/* User */}

        <div className="border-t border-[#e4e5ee] p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e3dfff] text-sm font-bold text-[#4338ca]">
              KP
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold">
                Kumar
              </p>

              <p className="truncate text-xs text-[#9997a7]">
                Free account
              </p>

            </div>

            <MoreHorizontal
              size={18}
              className="text-[#9997a7]"
            />

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <div className="lg:ml-64">

        {/* Topbar */}

        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#e4e5ee] bg-[#f8f9ff]/90 px-6 backdrop-blur-xl lg:px-8">

          <div>

            <p className="text-xs text-[#9997a7]">
              Workspace
            </p>

            <h1 className="text-sm font-bold">
              Overview
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/chat"
              className="hidden items-center gap-2 rounded-lg bg-[#2a14b4] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4338ca] sm:flex"
            >
              <MessageSquare
                size={15}
              />
              New Chat
            </Link>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e3dfff] text-xs font-bold text-[#4338ca]">
              KP
            </div>

          </div>

        </header>

        {/* Content */}

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

          {/* Welcome */}

          <section>

            <p className="text-sm font-medium text-[#4338ca]">
              Good to see you 👋
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight">
              Your knowledge workspace
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777586]">
              Manage your knowledge base, upload new information and
              start conversations with your AI assistant.
            </p>

          </section>

          {/* ================= STATS ================= */}

          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              icon={
                <FileText size={19} />
              }
              label="Documents"
              value={String(
                documentCount
              )}
              description="Uploaded files"
            />

            <StatCard
              icon={
                <Database size={19} />
              }
              label="Knowledge Chunks"
              value={String(
                chunkCount
              )}
              description="Indexed chunks"
            />

            <StatCard
              icon={
                <Globe size={19} />
              }
              label="Websites"
              value={String(
                websiteCount
              )}
              description="Connected sources"
            />

            <StatCard
              icon={
                <MessageSquare size={19} />
              }
              label="Conversations"
              value="0"
              description="Saved chats"
            />

          </section>

          {/* ================= MAIN GRID ================= */}

          <section className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* Knowledge */}

            <div className="lg:col-span-2 rounded-2xl border border-[#e4e5ee] bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-bold">
                    Knowledge Base
                  </h3>

                  <p className="mt-1 text-xs text-[#9997a7]">
                    Add information your AI assistant can use.
                  </p>

                </div>

                <Database
                  size={21}
                  className="text-[#4338ca]"
                />

              </div>

              {/* Knowledge cards */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* ================= DOCUMENT UPLOAD ================= */}

                <div
                  onClick={
                    openFilePicker
                  }
                  className={`group rounded-xl border border-dashed border-[#cfd0df] p-5 transition ${
                    uploading
                      ? "cursor-wait opacity-70"
                      : "cursor-pointer hover:border-[#4338ca] hover:bg-[#f8f9ff]"
                  }`}
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3dfff] text-[#4338ca]">
                    <Upload size={19} />
                  </div>

                  <h4 className="mt-4 text-sm font-bold">
                    Upload Documents
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-[#777586]">
                    Add PDF, DOCX, TXT, CSV or Markdown files.
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#4338ca]">

                    {uploading
                      ? "Uploading..."
                      : "Add documents"}

                    {!uploading && (
                      <ArrowUpRight
                        size={14}
                      />
                    )}

                  </span>

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept=".pdf,.docx,.txt,.md,.csv"
                    onChange={
                      handleFileUpload
                    }
                    className="hidden"
                  />

                </div>

                {/* ================= WEBSITE ================= */}

                <div
                  className={`rounded-xl border border-dashed border-[#cfd0df] p-5 transition ${
                    showWebsiteInput
                      ? "border-[#4338ca] bg-[#f8f9ff]"
                      : "hover:border-[#4338ca] hover:bg-[#f8f9ff]"
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3dfff] text-[#4338ca]">
                      <Globe size={19} />
                    </div>

                    {showWebsiteInput && (
                      <button
                        type="button"
                        onClick={
                          closeWebsiteInput
                        }
                        disabled={
                          websiteUploading
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[#9997a7] transition hover:bg-white hover:text-[#0b1c30]"
                      >
                        <X size={15} />
                      </button>
                    )}

                  </div>

                  <h4 className="mt-4 text-sm font-bold">
                    Add Website
                  </h4>

                  {!showWebsiteInput ? (
                    <>
                      <p className="mt-1 text-xs leading-5 text-[#777586]">
                        Connect useful website content to your knowledge base.
                      </p>

                      <button
                        type="button"
                        onClick={
                          openWebsiteInput
                        }
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#4338ca] transition hover:text-[#2a14b4]"
                      >
                        Add website
                        <Plus size={14} />
                      </button>
                    </>
                  ) : (
                    <form
                      onSubmit={
                        handleWebsiteUpload
                      }
                      className="mt-4"
                    >

                      <p className="mb-3 text-xs leading-5 text-[#777586]">
                        Enter a public website URL to add its content to your knowledge base.
                      </p>

                      <input
                        type="url"
                        value={
                          websiteUrl
                        }
                        onChange={(
                          e
                        ) =>
                          setWebsiteUrl(
                            e.target
                              .value
                          )
                        }
                        placeholder="https://example.com"
                        disabled={
                          websiteUploading
                        }
                        className="h-10 w-full rounded-lg border border-[#d8d9e4] bg-white px-3 text-xs text-[#0b1c30] outline-none transition placeholder:text-[#aaa8b5] focus:border-[#4338ca] focus:ring-2 focus:ring-[#4338ca]/10 disabled:opacity-60"
                        autoFocus
                      />

                      <button
                        type="submit"
                        disabled={
                          websiteUploading ||
                          !websiteUrl.trim()
                        }
                        className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#4338ca] px-4 text-xs font-semibold text-white transition hover:bg-[#2a14b4] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {websiteUploading ? (
                          <>
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus
                              size={14}
                            />
                            Add Website
                          </>
                        )}
                      </button>

                    </form>
                  )}

                  {/* Website Success */}

                  {websiteMessage && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">

                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-green-600"
                      />

                      <p className="text-[11px] leading-4 text-green-700">
                        {websiteMessage}
                      </p>

                    </div>
                  )}

                  {/* Website Error */}

                  {websiteError && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">

                      <AlertCircle
                        size={15}
                        className="mt-0.5 shrink-0 text-red-600"
                      />

                      <p className="text-[11px] leading-4 text-red-700">
                        {websiteError}
                      </p>

                    </div>
                  )}

                </div>

              </div>

              {/* ================= DOCUMENT SUCCESS ================= */}

              {uploadMessage && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                  <p className="text-sm text-green-700">
                    ✓ {uploadMessage}
                  </p>

                </div>
              )}

              {/* ================= DOCUMENT ERROR ================= */}

              {uploadError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                  <p className="text-sm text-red-700">
                    ✕ {uploadError}
                  </p>

                </div>
              )}

            </div>

            {/* ================= QUICK START ================= */}

            <div className="rounded-2xl bg-[#213145] p-6 text-white shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <MessageSquare size={19} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Start a conversation
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/60">
                Ask questions about your documents and connected
                websites using natural language.
              </p>

              <Link
                href="/chat"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#213145] transition hover:bg-[#eff4ff]"
              >
                <MessageSquare
                  size={16}
                />
                Open AI Assistant
              </Link>

            </div>

          </section>

          {/* ================= RECENT ACTIVITY ================= */}

          <section className="mt-8 rounded-2xl border border-[#e4e5ee] bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-[#e4e5ee] px-6 py-5">

              <div>

                <h3 className="text-lg font-bold">
                  Recent Activity
                </h3>

                <p className="mt-1 text-xs text-[#9997a7]">
                  Your latest knowledge and conversations.
                </p>

              </div>

              <button
                type="button"
                className="text-xs font-semibold text-[#4338ca]"
              >
                View all
              </button>

            </div>

            {activities.length === 0 ? (

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#4338ca]">
                  <Search size={23} />
                </div>

                <h4 className="mt-5 text-sm font-bold">
                  No activity yet
                </h4>

                <p className="mt-2 max-w-sm text-xs leading-5 text-[#9997a7]">
                  Upload your first document or start a conversation
                  to begin using your knowledge assistant.
                </p>

                <button
                  type="button"
                  onClick={
                    openFilePicker
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4338ca] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2a14b4]"
                >
                  <Plus size={15} />
                  Add Knowledge
                </button>

              </div>

            ) : (

              <div className="divide-y divide-[#e4e5ee]">

                {activities.map(
                  (
                    activity,
                    index
                  ) => (

                    <div
                      key={`${activity.timestamp}-${index}`}
                      className="flex items-center gap-4 px-6 py-5"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff4ff] text-[#4338ca]">

                        {activity.type ===
                        "upload" ? (

                          <Upload
                            size={18}
                          />

                        ) : activity.type ===
                          "delete" ? (

                          <Trash2
                            size={18}
                          />

                        ) : activity.type ===
                          "website" ? (

                          <Globe
                            size={18}
                          />

                        ) : (

                          <FileText
                            size={18}
                          />

                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold">
                          {activity.message}
                        </p>

                        <p className="mt-1 text-xs text-[#9997a7]">
                          {activity.details}
                        </p>

                      </div>

                      <p className="hidden shrink-0 text-[11px] text-[#9997a7] sm:block">

                        {new Date(
                          activity.timestamp
                        ).toLocaleString(
                          [],
                          {
                            dateStyle:
                              "medium",
                            timeStyle:
                              "short",
                          }
                        )}

                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </div>

    </main>
  );
}

/* ================= SIDEBAR ITEM ================= */

function SidebarItem({
  icon,
  label,
  active,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  href?: string;
}) {

  const content = (
    <div
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-[#eff4ff] font-semibold text-[#4338ca]"
          : "text-[#777586] hover:bg-[#f8f9ff] hover:text-[#0b1c30]"
      }`}
    >
      {icon}

      <span>{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left"
    >
      {content}
    </button>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {

  return (
    <div className="rounded-2xl border border-[#e4e5ee] bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff4ff] text-[#4338ca]">
          {icon}
        </div>

        <span className="text-[10px] font-medium text-green-600">
          Ready
        </span>

      </div>

      <p className="mt-5 text-xs text-[#777586]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-[#9997a7]">
        {description}
      </p>

    </div>
  );
}