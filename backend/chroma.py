import hashlib

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_chroma import Chroma

from embedding import embedding_model


CHROMA_PATH = "./chroma_db"


# --------------------------------
# GET CHROMA DATABASE
# --------------------------------

def get_vector_db():

    vector_db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_model
    )

    return vector_db


# --------------------------------
# SPLIT DOCUMENTS
# --------------------------------

def split_documents(documents):

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = text_splitter.split_documents(
        documents
    )

    return chunks


# --------------------------------
# CREATE UNIQUE ID
# --------------------------------

def create_chunk_id(document, index):

    source = document.metadata.get(
        "file_name",
        document.metadata.get(
            "source",
            "unknown"
        )
    )

    page = document.metadata.get(
        "page",
        ""
    )

    text = document.page_content

    raw_id = (
        f"{source}-"
        f"{page}-"
        f"{index}-"
        f"{text}"
    )

    return hashlib.md5(
        raw_id.encode("utf-8")
    ).hexdigest()


# --------------------------------
# ADD DOCUMENTS
# --------------------------------

def add_documents(documents):

    if not documents:

        return 0

    print(
        f"Received {len(documents)} documents"
    )

    # Split into chunks
    chunks = split_documents(
        documents
    )

    print(
        f"Created {len(chunks)} chunks"
    )

    vector_db = get_vector_db()

    ids = []

    for index, chunk in enumerate(chunks):

        chunk_id = create_chunk_id(
            chunk,
            index
        )

        ids.append(chunk_id)

    # Add to Chroma
    vector_db.add_documents(
        documents=chunks,
        ids=ids
    )

    print(
        "Documents added to Chroma successfully!"
    )

    return len(chunks)


# --------------------------------
# DATABASE COUNT
# --------------------------------

def get_document_count():

    vector_db = get_vector_db()

    collection = vector_db._collection

    data = collection.get(
        include=["metadatas"]
    )

    metadatas = data.get(
        "metadatas",
        []
    )

    unique_documents = set()

    for metadata in metadatas:

        if not metadata:
            continue

        file_name = metadata.get(
            "file_name"
        )

        if file_name:
            unique_documents.add(
                file_name
            )

    return len(unique_documents)


# --------------------------------
# CHUNK COUNT
# --------------------------------

def get_chunk_count():

    vector_db = get_vector_db()

    return vector_db._collection.count()


# --------------------------------
# DATABASE STATS
# --------------------------------

def get_database_stats():

    return {
        "documents": get_document_count(),
        "chunks": get_chunk_count()
    }

def get_documents():
    vector_db = get_vector_db()

    data = vector_db._collection.get(
        include=["metadatas"]
    )

    metadatas = data.get("metadatas", [])

    documents = {}

    for metadata in metadatas:
        if not metadata:
            continue

        file_name = metadata.get("file_name")

        if not file_name:
            continue

        if file_name not in documents:
            documents[file_name] = {
                "file_name": file_name,
                "type": metadata.get(
                    "source_type",
                    "unknown"
                ),
                "chunks": 0
            }

        documents[file_name]["chunks"] += 1

    return list(documents.values())

def delete_document(file_name):
    vector_db = get_vector_db()

    collection = vector_db._collection

    data = collection.get(
        where={
            "file_name": file_name
        }
    )

    ids = data.get("ids", [])

    if not ids:
        return 0

    collection.delete(
        ids=ids
    )

    return len(ids)