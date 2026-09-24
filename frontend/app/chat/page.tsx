"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  BookOpen,
  Database,
  FileText,
  Globe,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sparkles,
  Upload,
  ArrowUpRight,
  Clock3,
  MoreHorizontal,
  Trash2,
} from "lucide-react";


// ======================================================
// TYPES
// ======================================================

type Source = {
  filename?: string;
  page?: number;
  content?: string;
  score?: number;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

type Chat = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function ChatPage() {
  // ----------------------------------------------------
  // UI STATE
  // ----------------------------------------------------

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [question, setQuestion] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [chatId, setChatId] = useState<number | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  const initializedRef = useRef(false);


  // ----------------------------------------------------
  // API URL
  // ----------------------------------------------------

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";


  // ====================================================
  // NORMALIZE SOURCES
  // ====================================================

  const normalizeSources = (sources: any): Source[] => {
    if (!Array.isArray(sources)) {
      return [];
    }

    return sources.map((source) => ({
      filename:
        source?.filename ||
        source?.file_name ||
        source?.source ||
        "Unknown source",

      page:
        source?.page ??
        source?.page_number ??
        undefined,

      content:
        source?.content ||
        source?.text ||
        "",

      score:
        source?.score ??
        source?.similarity ??
        undefined,
    }));
  };


  // ====================================================
  // LOAD ALL CHATS
  // ====================================================

  const loadChats = async (): Promise<Chat[]> => {
    try {
      const response = await fetch(
        `${API_URL}/chats`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load chats: ${response.status}`
        );
      }

      const data = await response.json();

      const loadedChats: Chat[] =
        Array.isArray(data?.chats)
          ? data.chats
          : [];

      setChats(loadedChats);

      return loadedChats;

    } catch (error) {
      console.error(
        "LOAD CHATS ERROR:",
        error
      );

      return [];
    }
  };


  // ====================================================
  // LOAD MESSAGES FOR CHAT
  // ====================================================

  const loadChatMessages = async (
    id: number
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/chats/${id}/messages`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load messages: ${response.status}`
        );
      }

      const data = await response.json();

      const loadedMessages =
        Array.isArray(data?.messages)
          ? data.messages
          : [];

      setMessages(
        loadedMessages.map(
          (message: any) => ({
            role:
              message.role === "user"
                ? "user"
                : "assistant",

            content:
              message.content || "",

            sources:
              normalizeSources(
                message.sources
              ),
          })
        )
      );

    } catch (error) {
      console.error(
        "LOAD CHAT MESSAGES ERROR:",
        error
      );

      setMessages([]);
    }
  };


  // ====================================================
  // CREATE NEW CHAT
  // ====================================================

  const createNewChat = async (): Promise<number> => {
    const response = await fetch(
      `${API_URL}/chats`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          title: "New Chat",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to create chat"
      );
    }

    const data = await response.json();

    return data.chat_id;
  };


  // ====================================================
  // INITIALIZE CHAT
  // ====================================================

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const initializeChat = async () => {
      try {
        const existingChats =
          await loadChats();

        // ----------------------------------------------
        // Existing chat found
        // ----------------------------------------------

        if (existingChats.length > 0) {
          const latestChat =
            existingChats[0];

          setChatId(latestChat.id);

          await loadChatMessages(
            latestChat.id
          );

          return;
        }

        // ----------------------------------------------
        // No chats → create one
        // ----------------------------------------------

        const newChatId =
          await createNewChat();

        setChatId(newChatId);

        setMessages([
          {
            role: "assistant",

            content:
              "Hello! I'm your AI Knowledge Assistant. Upload documents or add websites, then ask me anything about your knowledge base.",

            sources: [],
          },
        ]);

        await loadChats();

      } catch (error) {
        console.error(
          "INITIALIZE CHAT ERROR:",
          error
        );
      }
    };

    initializeChat();
  }, []);


  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const sendMessage = async () => {
    const trimmedQuestion =
      question.trim();

    if (
      !trimmedQuestion ||
      isLoading ||
      chatId === null
    ) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: trimmedQuestion,
      sources: [],
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setQuestion("");

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            question:
              trimmedQuestion,

            chat_id: chatId,
          }),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Request failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      const assistantMessage: Message =
        {
          role: "assistant",

          content:
            data?.answer ||
            "I could not find an answer.",

          sources:
            normalizeSources(
              data?.sources
            ),
        };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

      // Refresh sidebar titles
      await loadChats();

    } catch (error) {
      console.error(
        "SEND MESSAGE ERROR:",
        error
      );

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          content:
            "Sorry, something went wrong while processing your question. Please make sure the backend is running and try again.",

          sources: [],
        },
      ]);

    } finally {
      setIsLoading(false);
    }
  };


  // ====================================================
  // ENTER KEY
  // ====================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };


  // ====================================================
  // START NEW CHAT
  // ====================================================

  const startNewChat = async () => {
    try {
      const newChatId =
        await createNewChat();

      setChatId(newChatId);

      setMessages([
        {
          role: "assistant",

          content:
            "Hello! I'm your AI Knowledge Assistant. Upload documents or add websites, then ask me anything about your knowledge base.",

          sources: [],
        },
      ]);

      await loadChats();

    } catch (error) {
      console.error(
        "NEW CHAT ERROR:",
        error
      );
    }
  };


  // ====================================================
  // SELECT CHAT
  // ====================================================

  const selectChat = async (
    id: number
  ) => {
    if (id === chatId) {
      return;
    }

    setChatId(id);

    setMessages([]);

    await loadChatMessages(id);
  };


  // ====================================================
  // DELETE CHAT
  // ====================================================

  const deleteChat = async (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this chat?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/chats/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          `Failed to delete chat: ${response.status}`
        );
      }

      // ----------------------------------------------
      // Remove chat from local state
      // ----------------------------------------------

      const remainingChats =
        chats.filter(
          (chat) => chat.id !== id
        );

      setChats(remainingChats);


      // ----------------------------------------------
      // If deleted chat was active
      // ----------------------------------------------

      if (chatId === id) {

        // --------------------------------------------
        // Open another existing chat
        // --------------------------------------------

        if (
          remainingChats.length > 0
        ) {
          const nextChat =
            remainingChats[0];

          setChatId(nextChat.id);

          await loadChatMessages(
            nextChat.id
          );

        }

        // --------------------------------------------
        // No chats left
        // Create fresh chat
        // --------------------------------------------

        else {
          const newChatId =
            await createNewChat();

          setChatId(newChatId);

          setMessages([
            {
              role: "assistant",

              content:
                "Hello! I'm your AI Knowledge Assistant. Upload documents or add websites, then ask me anything about your knowledge base.",

              sources: [],
            },
          ]);

          await loadChats();
        }
      }

    } catch (error) {
      console.error(
        "DELETE CHAT ERROR:",
        error
      );

      alert(
        "Failed to delete chat. Please try again."
      );
    }
  };


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="flex h-screen overflow-hidden bg-[#08090d] text-white">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      {sidebarOpen && (
        <aside className="flex w-[280px] shrink-0 flex-col border-r border-white/10 bg-[#0d0f14]">

          {/* ----------------------------------------------
              LOGO
          ---------------------------------------------- */}

          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
                <Sparkles size={18} />
              </div>

              <div>
                <div className="text-sm font-semibold">
                  Knowledge AI
                </div>

                <div className="text-[11px] text-white/40">
                  AI Knowledge Assistant
                </div>
              </div>
            </Link>

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
            >
              <MoreHorizontal
                size={18}
              />
            </button>
          </div>


          {/* ----------------------------------------------
              NEW CHAT
          ---------------------------------------------- */}

          <div className="p-4">

            <button
              onClick={startNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <Plus size={17} />

              New Chat
            </button>

          </div>


          {/* ----------------------------------------------
              KNOWLEDGE
          ---------------------------------------------- */}

          <div className="px-3">

            <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Knowledge
            </div>


            <Link
              href="/documents"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <FileText size={17} />

              Documents

              <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                Files
              </span>
            </Link>


            <button
              className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <Globe size={17} />

              Websites

              <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                Soon
              </span>
            </button>


            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <Database size={17} />

              Knowledge Base
            </button>

          </div>


          {/* ----------------------------------------------
              CHAT HISTORY
          ---------------------------------------------- */}

          <div className="mt-6 flex min-h-0 flex-1 flex-col px-3">

            <div className="mb-2 flex items-center justify-between px-2">

              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Chat History
              </div>

              <Clock3
                size={13}
                className="text-white/20"
              />

            </div>


            <div className="flex-1 overflow-y-auto">

              {chats.length === 0 ? (

                <div className="px-3 py-6 text-center text-xs text-white/30">
                  No conversations yet.
                </div>

              ) : (

                <div className="space-y-1">

                  {chats.map((chat) => (

                    <div
                      key={chat.id}
                      className={`group flex items-center rounded-xl transition ${
                        chatId === chat.id
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >

                      {/* CHAT SELECT */}

                      <button
                        onClick={() =>
                          selectChat(
                            chat.id
                          )
                        }
                        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left"
                      >

                        <MessageSquare
                          size={15}
                          className="shrink-0"
                        />

                        <span className="truncate text-sm">
                          {chat.title}
                        </span>

                      </button>


                      {/* DELETE */}

                      <button
                        onClick={() =>
                          deleteChat(
                            chat.id
                          )
                        }
                        title="Delete chat"
                        className="mr-2 rounded-lg p-1.5 text-white/30 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                      >
                        <Trash2
                          size={14}
                        />
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>


          {/* ----------------------------------------------
              BOTTOM SIDEBAR
          ---------------------------------------------- */}

          <div className="border-t border-white/10 p-3">

            <Link
              href="/dashboard"
              className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              <ArrowUpRight
                size={16}
              />

              Dashboard
            </Link>


            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={16} />

              Settings
            </button>

          </div>

        </aside>
      )}


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="flex min-w-0 flex-1 flex-col">

        {/* ----------------------------------------------
            TOP BAR
        ---------------------------------------------- */}

        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#0b0c10]/80 px-6 backdrop-blur-xl">

          <div className="flex items-center gap-4">

            {!sidebarOpen && (
              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <MoreHorizontal
                  size={18}
                />
              </button>
            )}


            <div>

              <h1 className="text-sm font-semibold">
                AI Knowledge Assistant
              </h1>

              <p className="text-[11px] text-white/35">
                Ask questions about your knowledge base
              </p>

            </div>

          </div>


          {/* MODEL */}

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex">

              <Sparkles
                size={14}
                className="text-violet-400"
              />

              <span className="text-xs text-white/60">
                Gemini
              </span>

            </div>

          </div>

        </header>


        {/* ----------------------------------------------
            CHAT AREA
        ---------------------------------------------- */}

        <div className="flex-1 overflow-y-auto">

          <div className="mx-auto flex w-full max-w-4xl flex-col px-5 py-8">

            {/* EMPTY / WELCOME */}

            {messages.length === 0 && !isLoading && (

              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-white/10">

                  <Sparkles
                    size={28}
                    className="text-violet-400"
                  />

                </div>

                <h2 className="text-2xl font-semibold">
                  Ask your knowledge anything
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                  Your AI assistant searches your uploaded knowledge base and generates answers using the relevant information.
                </p>

              </div>
            )}


            {/* MESSAGES */}

            <div className="space-y-7">

              {messages.map(
                (message, index) => (

                  <div
                    key={index}
                    className={
                      message.role ===
                      "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >

                    <div
                      className={
                        message.role ===
                        "user"
                          ? "max-w-[80%]"
                          : "max-w-[90%]"
                      }
                    >

                      {/* ROLE */}

                      <div
                        className={`mb-2 flex items-center gap-2 text-[11px] font-medium ${
                          message.role ===
                          "user"
                            ? "justify-end text-white/30"
                            : "text-violet-400"
                        }`}
                      >

                        {message.role ===
                        "assistant" ? (
                          <>
                            <Sparkles
                              size={12}
                            />

                            AI Assistant
                          </>
                        ) : (
                          "You"
                        )}

                      </div>


                      {/* MESSAGE */}

                      <div
                        className={
                          message.role ===
                          "user"
                            ? "rounded-2xl rounded-br-md bg-violet-600 px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-violet-900/20"
                            : "rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.035] px-4 py-4 text-sm leading-7 text-white/80"
                        }
                      >

                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>

                      </div>


                      {/* SOURCES */}

                      {message.role ===
                        "assistant" &&
                        message.sources &&
                        message.sources.length >
                          0 && (

                          <div className="mt-3">

                            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">

                              <BookOpen
                                size={12}
                              />

                              Sources

                            </div>


                            <div className="space-y-2">

                              {message.sources.map(
                                (
                                  source,
                                  sourceIndex
                                ) => (

                                  <div
                                    key={
                                      sourceIndex
                                    }
                                    className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                                  >

                                    <div className="flex items-center gap-2">

                                      <FileText
                                        size={13}
                                        className="text-violet-400"
                                      />

                                      <span className="text-xs font-medium text-white/70">
                                        {source.filename ||
                                          "Unknown source"}
                                      </span>

                                      {source.page !==
                                        undefined && (
                                        <span className="text-[10px] text-white/30">
                                          Page{" "}
                                          {
                                            source.page
                                          }
                                        </span>
                                      )}

                                    </div>


                                    {source.content && (
                                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/35">
                                        {
                                          source.content
                                        }
                                      </p>
                                    )}

                                  </div>

                                )
                              )}

                            </div>

                          </div>

                        )}

                    </div>

                  </div>

                )
              )}


              {/* LOADING */}

              {isLoading && (

                <div className="flex justify-start">

                  <div className="max-w-[90%]">

                    <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-violet-400">

                      <Sparkles
                        size={12}
                      />

                      AI Assistant

                    </div>


                    <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.035] px-5 py-4">

                      <div className="flex items-center gap-1.5">

                        <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                          style={{
                            animationDelay:
                              "120ms",
                          }}
                        />

                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
                          style={{
                            animationDelay:
                              "240ms",
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* ==================================================
            INPUT AREA
        ================================================== */}

        <div className="border-t border-white/10 bg-[#0b0c10]/90 px-5 py-4 backdrop-blur-xl">

          <div className="mx-auto max-w-4xl">

            <div className="relative rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20 transition focus-within:border-violet-500/40">

              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                disabled={
                  isLoading ||
                  chatId === null
                }
                placeholder={
                  chatId === null
                    ? "Initializing chat..."
                    : "Ask anything about your knowledge base..."
                }
                rows={1}
                className="w-full resize-none bg-transparent px-4 pb-14 pt-4 text-sm text-white outline-none placeholder:text-white/25 disabled:cursor-not-allowed"
              />


              {/* INPUT ACTIONS */}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">

                <div className="flex items-center gap-1">

                  <Link
                    href="/documents"
                    title="Upload documents"
                    className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                  >
                    <Upload
                      size={16}
                    />
                  </Link>


                  <button
                    title="Search knowledge base"
                    className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                  >
                    <Search
                      size={16}
                    />
                  </button>

                </div>


                <button
                  onClick={sendMessage}
                  disabled={
                    isLoading ||
                    !question.trim() ||
                    chatId === null
                  }
                  className="flex h-9 items-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-30"
                >

                  <Sparkles
                    size={14}
                  />

                  Ask AI

                </button>

              </div>

            </div>


            <div className="mt-2 text-center text-[10px] text-white/20">
              AI-generated answers may contain mistakes. Verify important information.
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}