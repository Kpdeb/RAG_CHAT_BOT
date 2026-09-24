import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

from chroma import get_vector_db

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in .env")


# --------------------------------
# GROQ LLM
# --------------------------------

llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0
)


# --------------------------------
# RAG
# --------------------------------

def ask_question(question):

    vector_db = get_vector_db()

    retriever = vector_db.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 5,
            "fetch_k": 15
        }
    )

    retrieved_docs = retriever.invoke(question)

    if not retrieved_docs:
        return {
            "answer": "I could not find the answer in the provided sources.",
            "sources": []
        }

    context_parts = []
    sources = []
    unique_sources = set()

    for doc in retrieved_docs:

        context_parts.append(doc.page_content)

        metadata = doc.metadata

        source = metadata.get(
            "file_name",
            metadata.get("source", "Unknown")
        )

        page = metadata.get("page", None)

        source_type = metadata.get(
            "source_type",
            "unknown"
        )

        source_key = (
            str(source),
            str(page),
            str(source_type)
        )

        if source_key not in unique_sources:

            unique_sources.add(source_key)

            sources.append({
                "source": source,
                "page": page,
                "type": source_type
            })

    context = "\n\n---\n\n".join(context_parts)

    prompt = f"""
You are an AI knowledge assistant.

Answer the user's question using ONLY
the information provided in the context.

Rules:

1. Do not use outside knowledge.
2. Do not invent information.
3. If the answer is not present in the context,
   say exactly:

"I could not find the answer in the provided sources."

4. Give a clear and useful answer.
5. Stay grounded in the provided sources.

CONTEXT:

{context}

USER QUESTION:

{question}
"""

    response = llm.invoke(prompt)

    if isinstance(response.content, str):

        answer = response.content

    else:

        answer_parts = []

        for block in response.content:

            if isinstance(block, dict):

                if block.get("type") == "text":
                    answer_parts.append(
                        block.get("text", "")
                    )

            elif isinstance(block, str):

                answer_parts.append(block)

        answer = "\n".join(answer_parts)

    return {
        "answer": answer,
        "sources": sources
    }