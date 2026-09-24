import os

from dotenv import load_dotenv

from langchain_google_genai import GoogleGenerativeAIEmbeddings


# --------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")


if not api_key:
    raise ValueError(
        "GOOGLE_API_KEY not found in .env file"
    )


print("API key loaded:", True)


# --------------------------------
# EMBEDDING MODEL
# --------------------------------

embedding_model = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
    google_api_key=api_key
)