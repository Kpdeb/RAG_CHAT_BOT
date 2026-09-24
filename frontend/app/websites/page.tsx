"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Database,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Website = {
  file_name: string;
  type?: string;
  chunks?: number;
};

type WebsiteResponse = {
  message?: string;
  url?: string;
  documents_loaded?: number;
  chunks_added?: number;
  total_documents?: number;
  total_chunks?: number;
};

export default function WebsitesPage() {
  const [url, setUrl] = useState("");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingWebsites, setLoadingWebsites] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // -----------------------------------------
  // LOAD WEBSITES
  // -----------------------------------------

  const loadWebsites = async () => {
    try {
      setLoadingWebsites(true);
      setError("");

      const response = await fetch(`${API_URL}/documents`);

      if (!response.ok) {
        throw new Error("Failed to load websites.");
      }

      const data = await response.json();

      const websiteList = (data.documents || []).filter(
        (doc: Website) => doc.type === "website"
      );

      setWebsites(websiteList);
    } catch (err) {
      console.error(err);
      setError("Failed to load websites.");
    } finally {
      setLoadingWebsites(false);
    }
  };

  // -----------------------------------------
  // INITIAL LOAD
  // -----------------------------------------

  useEffect(() => {
    loadWebsites();
  }, []);

  // -----------------------------------------
  // ADD WEBSITE
  // -----------------------------------------

  const addWebsite = async (e: FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a website URL.");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/websites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data: WebsiteResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add website."
        );
      }

      setSuccess(
        data.message ||
          `Website added successfully. ${data.chunks_added || 0} chunks created.`
      );

      setUrl("");

      await loadWebsites();
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add website.");
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // DELETE WEBSITE
  // -----------------------------------------

  const deleteWebsite = async (websiteUrl: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this website?\n\n${websiteUrl}`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(websiteUrl);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/documents/${encodeURIComponent(websiteUrl)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete website."
        );
      }

      setSuccess("Website deleted successfully.");

      await loadWebsites();
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete website.");
      }
    } finally {
      setDeleting(null);
    }
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HEADER */}

      <header className="border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Globe size={20} className="text-blue-400" />
              </div>

              <div>
                <h1 className="text-sm font-semibold">
                  Websites
                </h1>

                <p className="text-xs text-gray-500">
                  Add websites to your knowledge base
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={loadWebsites}
            disabled={loadingWebsites}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                loadingWebsites ? "animate-spin" : ""
              }
            />

            Refresh
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* TITLE */}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Website Knowledge
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add public websites and use their content as a
            source for your AI assistant.
          </p>
        </div>

        {/* ADD WEBSITE CARD */}

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Plus size={20} className="text-blue-400" />
            </div>

            <div>
              <h3 className="font-medium">
                Add a website
              </h3>

              <p className="text-xs text-gray-500">
                The website content will be extracted,
                chunked and indexed for RAG.
              </p>
            </div>
          </div>

          <form
            onSubmit={addWebsite}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Globe
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add Website
                </>
              )}
            </button>
          </form>

          {/* SUCCESS */}

          {success && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{success}</span>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}
        </div>

        {/* WEBSITE LIST */}

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Added Websites
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {websites.length} website
                {websites.length !== 1 ? "s" : ""} in your
                knowledge base
              </p>
            </div>
          </div>

          {loadingWebsites ? (
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-white/10 bg-[#111111]">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Loading websites...
              </div>
            </div>
          ) : websites.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111111] px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                <Globe
                  size={26}
                  className="text-gray-500"
                />
              </div>

              <h4 className="text-sm font-medium text-gray-300">
                No websites added yet
              </h4>

              <p className="mt-2 max-w-md text-xs leading-5 text-gray-600">
                Add a public website above to make its
                content searchable through your AI
                assistant.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {websites.map((website) => (
                <div
                  key={website.file_name}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#111111] p-4 transition hover:border-white/20 hover:bg-[#151515]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                      <Globe
                        size={21}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-blue-400">
                          Website
                        </span>

                        {website.chunks !== undefined && (
                          <span className="flex items-center gap-1 text-[11px] text-gray-600">
                            <Database size={11} />
                            {website.chunks} chunks
                          </span>
                        )}
                      </div>

                      <p className="mt-2 truncate text-sm text-gray-300">
                        {website.file_name}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 flex shrink-0 items-center gap-2">
                    <a
                      href={website.file_name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/10 hover:text-white"
                      title="Open website"
                    >
                      <ExternalLink size={16} />
                    </a>

                    <button
                      onClick={() =>
                        deleteWebsite(website.file_name)
                      }
                      disabled={
                        deleting === website.file_name
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                      title="Delete website"
                    >
                      {deleting === website.file_name ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}