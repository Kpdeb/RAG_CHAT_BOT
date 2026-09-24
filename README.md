# 🧠 AI Knowledge Assistant

An AI-powered knowledge assistant that allows users to upload documents and connect websites, build a searchable knowledge base, and ask questions using natural language.

The application uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from uploaded sources before generating an answer with an LLM.

## 🚀 Live Demo

### Frontend
https://rag-chat-bot-lake-sigma.vercel.app

### Backend API
https://rag-chat-bot-0fa6.onrender.com

---
---
The UI :
<img width="1887" height="976" alt="image" src="https://github.com/user-attachments/assets/ad24a38f-1a15-4116-826f-8814f3bcbc2a" />

<img width="1916" height="973" alt="image" src="https://github.com/user-attachments/assets/a01e899a-31b9-4ec1-aa0b-1e4c14f63c60" />

dashboard ui 
<img width="1887" height="957" alt="image" src="https://github.com/user-attachments/assets/d3a8edfc-a6a1-45cc-8e47-8de6d4c264cd" />





## ✨ Features

- 📄 Upload and process documents
- 🌐 Add websites as knowledge sources
- 🔎 Semantic search using vector embeddings
- 🤖 AI-powered question answering
- 📚 Source-aware responses
- 💬 Persistent chat conversations
- 🗑️ Delete conversations
- 📊 Knowledge base statistics
- 🧩 Document and website management
- ⚡ Next.js responsive frontend
- 🚀 FastAPI backend
- ☁️ Vercel + Render deployment

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │        User             │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Next.js Frontend    │
                    │        Vercel            │
                    └────────────┬────────────┘
                                 │
                          REST API Requests
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Backend    │
                    │         Render          │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       Document Loader     Website Loader      Chat System
              │                  │                  │
              └────────────┬─────┘                  │
                           ▼                        │
                  Text Extraction                  │
                           │                        │
                           ▼                        │
                  Text Chunking                    │
                           │                        │
                           ▼                        │
                Google Gemini Embeddings            │
                           │                        │
                           ▼                        │
                     ChromaDB                       │
                           │                        │
                           ▼                        │
                      Retrieval                    │
                           │                        │
                           ▼                        │
                    Groq LLM                       │
                           │                        │
                           ▼                        │
                     AI Answer ◄───────────────────┘


Document / Website
        │
        ▼
Text Extraction
        │
        ▼
Text Cleaning
        │
        ▼
Text Chunking
        │
        ▼
Gemini Embeddings
        │
        ▼
Chroma Vector Database
        │
        ▼
User Question
        │
        ▼
MMR Retrieval
        │
        ▼
Relevant Context
        │
        ▼
Groq LLM
        │
        ▼
Grounded Answer + Sources
