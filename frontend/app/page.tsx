import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe,
  Search,
  ShieldCheck,
  Upload,
  FileText,
  MessageSquare,
  Database,
  CheckCircle2,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 z-50 w-full border-b border-[#e5e7f0]/70 bg-[#f8f9ff]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4338ca] text-white shadow-sm">
              <Sparkles size={19} />
            </div>

            <span className="text-sm font-bold tracking-tight sm:text-base">
              AI Knowledge Assistant
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <a
              href="#features"
              className="text-sm text-[#464554] transition hover:text-[#2a14b4]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-[#464554] transition hover:text-[#2a14b4]"
            >
              How it Works
            </a>

            <a
              href="#use-cases"
              className="text-sm text-[#464554] transition hover:text-[#2a14b4]"
            >
              Use Cases
            </a>

            <a
              href="#preview"
              className="text-sm text-[#464554] transition hover:text-[#2a14b4]"
            >
              Preview
            </a>
          </nav>

          <div className="flex items-center gap-2">

            {/* LOGIN - KEEP FOR FUTURE AUTHENTICATION */}
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-[#464554] transition hover:bg-white sm:block"
            >
              Log in
            </Link>

            {/* GUEST / DEMO ACCESS */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-[#4338ca] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#2a14b4]"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pt-32">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 opacity-70 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-12 lg:px-12 lg:py-28">

          {/* Hero text */}
          <div className="lg:col-span-6">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#4338ca] shadow-sm ring-1 ring-black/5">
              <Sparkles size={14} />
              Powered by RAG • Semantic Search • AI
            </div>

            <h1 className="text-5xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-6xl">
              Turn Your Knowledge Into an{" "}
              <span className="bg-gradient-to-r from-[#2a14b4] to-[#8455ef] bg-clip-text text-transparent">
                AI Assistant
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#464554]">
              Upload your documents, connect websites, and ask questions
              across your knowledge base with contextual AI answers and
              verifiable source citations.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              {/* GUEST / DEMO ACCESS */}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2a14b4] px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4338ca]"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#0b1c30] shadow-sm ring-1 ring-black/5 transition hover:bg-[#eff4ff]"
              >
                <PlayCircle size={19} className="text-[#6b38d4]" />
                See How It Works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#777586]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#4338ca]" />
                Source-backed answers
              </span>

              <span className="flex items-center gap-2">
                <Database size={16} className="text-[#4338ca]" />
                Your knowledge base
              </span>

              <span className="flex items-center gap-2">
                <Search size={16} className="text-[#4338ca]" />
                Semantic retrieval
              </span>
            </div>
          </div>

          {/* Hero product preview */}
          <div className="lg:col-span-6" id="preview">
            <div className="overflow-hidden rounded-2xl border border-[#c7c4d7] bg-white shadow-2xl shadow-indigo-100">

              {/* Browser header */}
              <div className="flex items-center justify-between border-b bg-[#213145] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>

                <span className="text-[10px] text-white/60">
                  AI Knowledge Assistant
                </span>

                <span className="rounded bg-indigo-500/30 px-2 py-1 text-[9px] text-indigo-100">
                  RAG Engine
                </span>
              </div>

              <div className="grid min-h-[410px] grid-cols-12">

                {/* Mini sidebar */}
                <div className="col-span-4 hidden bg-[#323a4f] p-4 text-white sm:block">
                  <div className="mb-5 rounded-lg bg-[#495167] p-3">
                    <div className="flex items-center gap-2">
                      <Database size={16} />
                      <span className="text-xs font-semibold">
                        Knowledge Base
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-white/50">
                      12 sources • 420 KB
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="rounded-lg bg-white/10 px-3 py-2">
                      💬 Active Chat
                    </div>

                    <div className="px-3 py-2 text-white/50">
                      📄 Documents
                    </div>

                    <div className="px-3 py-2 text-white/50">
                      🌐 Websites
                    </div>

                    <div className="px-3 py-2 text-white/50">
                      🕘 Chat History
                    </div>
                  </div>

                  <div className="mt-20 rounded-lg bg-[#495167] p-3">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/60">
                        Knowledge Base
                      </span>
                      <span className="text-green-300">
                        Ready
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-full rounded-full bg-indigo-300" />
                    </div>
                  </div>
                </div>

                {/* Chat preview */}
                <div className="col-span-12 flex flex-col justify-between bg-white p-5 sm:col-span-8">

                  <div>
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-[#777586]">
                        AI Knowledge Assistant
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        Ask anything about your knowledge
                      </h3>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[#eff4ff] px-4 py-3 text-xs leading-5">
                        What are the key algorithmic patterns covered in
                        the DSA roadmap?
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4338ca] text-white">
                        <Sparkles size={15} />
                      </div>

                      <div className="rounded-2xl rounded-tl-none bg-[#f8f9ff] p-4 text-xs leading-5 shadow-sm">
                        <p>
                          The roadmap focuses on several important
                          algorithmic patterns including:
                        </p>

                        <ul className="mt-2 space-y-1 text-[#464554]">
                          <li>• Two-pointer and sliding window</li>
                          <li>• Dynamic programming</li>
                          <li>• Graph traversal and cycle detection</li>
                        </ul>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#dce9ff] px-2.5 py-1 text-[10px] font-medium text-[#2a14b4]">
                            DSA_Roadmap.pdf • Page 12
                          </span>

                          <span className="rounded-full bg-[#dce9ff] px-2.5 py-1 text-[10px] font-medium text-[#2a14b4]">
                            DSA_Roadmap.pdf • Page 18
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fake input */}
                  <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#eff4ff] p-2">
                    <Search size={18} className="ml-2 text-[#777586]" />

                    <span className="flex-1 text-xs text-[#777586]">
                      Ask anything about your knowledge base...
                    </span>

                    <button className="rounded-lg bg-[#2a14b4] px-3 py-2 text-xs font-semibold text-white">
                      Send
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section className="border-y border-[#e5eeff] bg-[#eff4ff] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 sm:grid-cols-3 lg:grid-cols-5 lg:px-12">

          <Capability
            icon={<BookOpen size={21} />}
            title="Multi-Document"
            text="Build one knowledge base"
          />

          <Capability
            icon={<Globe size={21} />}
            title="Website Knowledge"
            text="Connect online content"
          />

          <Capability
            icon={<Search size={21} />}
            title="Semantic Search"
            text="Find relevant context"
          />

          <Capability
            icon={<CheckCircle2 size={21} />}
            title="Source Citations"
            text="Trace answers to sources"
          />

          <Capability
            icon={<MessageSquare size={21} />}
            title="Persistent Chats"
            text="Keep conversations"
          />

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-12"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4338ca]">
            Built for knowledge
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to talk to your knowledge
          </h2>

          <p className="mt-4 text-base leading-7 text-[#464554]">
            Bring your documents and websites together and interact with
            them through an intelligent conversational interface.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <Feature
            icon={<Upload />}
            title="Multi-Document Knowledge"
            text="Upload PDFs, DOCX, TXT, CSV and Markdown files into your knowledge base."
          />

          <Feature
            icon={<Globe />}
            title="Website Knowledge"
            text="Add website URLs and make useful online content available to your assistant."
          />

          <Feature
            icon={<Search />}
            title="Intelligent Retrieval"
            text="Retrieve relevant context before generating an answer."
          />

          <Feature
            icon={<CheckCircle2 />}
            title="Source Citations"
            text="See which documents and pages were used to generate an answer."
          />

          <Feature
            icon={<MessageSquare />}
            title="Persistent Conversations"
            text="Keep your conversations organized and return to previous chats."
          />

          <Feature
            icon={<Sparkles />}
            title="AI-Powered Answers"
            text="Generate contextual answers using your own indexed knowledge."
          />

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="bg-[#eff4ff] py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-12">

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4338ca]">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              From documents to answers
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[#464554]">
              A simple retrieval-augmented generation workflow turns your
              information into a conversational knowledge base.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-4">

            <Step
              number="01"
              title="Upload"
              text="Upload documents or add website URLs."
            />

            <Step
              number="02"
              title="Process"
              text="Content is extracted, chunked and embedded."
            />

            <Step
              number="03"
              title="Retrieve"
              text="Relevant knowledge is retrieved from the vector database."
            />

            <Step
              number="04"
              title="Ask"
              text="The AI generates an answer using the retrieved context."
            />

          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section
        id="use-cases"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-12"
      >
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4338ca]">
            Use cases
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Built for the way you learn and work
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <UseCase
            title="Students"
            text="Turn lecture notes and study material into an interactive AI tutor."
          />

          <UseCase
            title="Developers"
            text="Search technical documentation and project knowledge using natural language."
          />

          <UseCase
            title="Researchers"
            text="Interact with papers, reports and research documents."
          />

          <UseCase
            title="Professionals"
            text="Build a conversational interface over internal documentation."
          />

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#213145] px-8 py-16 text-center text-white shadow-xl sm:px-16">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Sparkles />
          </div>

          <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
            Start building your AI knowledge base
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-white/65">
            Bring your documents and websites together and start asking
            better questions.
          </p>

          {/* GUEST / DEMO ACCESS */}
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#213145] transition hover:bg-[#eff4ff]"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#e5eeff] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-[#777586] sm:flex-row sm:items-center sm:justify-between lg:px-12">

          <div className="flex items-center gap-2 font-semibold text-[#0b1c30]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4338ca] text-white">
              <Sparkles size={14} />
            </div>
            AI Knowledge Assistant
          </div>

          <p>© 2026 AI Knowledge Assistant</p>

          <div className="flex gap-5">
            <a href="#" className="hover:text-[#2a14b4]">
              Documentation
            </a>

            <a href="#" className="hover:text-[#2a14b4]">
              GitHub
            </a>

            <a href="#" className="hover:text-[#2a14b4]">
              Privacy
            </a>
          </div>

        </div>
      </footer>

    </main>
  );
}


/* ================= COMPONENTS ================= */

function Capability({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#4338ca] shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-[#777586]">{text}</p>
      </div>
    </div>
  );
}


function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#e5eeff] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e3dfff] text-[#4338ca] transition group-hover:bg-[#4338ca] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#464554]">
        {text}
      </p>
    </div>
  );
}


function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl bg-white p-6 shadow-sm">

      <span className="font-mono text-xs font-bold text-[#4338ca]">
        {number}
      </span>

      <h3 className="mt-4 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#777586]">
        {text}
      </p>
    </div>
  );
}


function UseCase({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-7 shadow-sm">
      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#464554]">
        {text}
      </p>
    </div>
  );
}