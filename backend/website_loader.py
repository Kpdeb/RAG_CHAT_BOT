import requests

from bs4 import BeautifulSoup
from langchain_core.documents import Document


# --------------------------------
# WEBSITE REQUEST SETTINGS
# --------------------------------

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 "
        "(Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/153.0.0.0 Safari/537.36"
    )
}

REQUEST_TIMEOUT = 20


# --------------------------------
# LOAD WEBSITE
# --------------------------------

def load_website(url: str):

    url = url.strip()

    if not url:
        raise ValueError(
            "Website URL cannot be empty."
        )

    # Add https automatically
    if not url.startswith(
        ("http://", "https://")
    ):
        url = "https://" + url

    print(
        f"Loading website: {url}"
    )

    # --------------------------------
    # REQUEST PAGE
    # --------------------------------

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=REQUEST_TIMEOUT
    )

    response.raise_for_status()

    # --------------------------------
    # PARSE HTML
    # --------------------------------

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    # --------------------------------
    # REMOVE UNNECESSARY ELEMENTS
    # --------------------------------

    for element in soup(
        [
            "script",
            "style",
            "noscript",
            "nav",
            "footer",
            "header",
            "svg"
        ]
    ):
        element.decompose()

    # --------------------------------
    # GET PAGE TITLE
    # --------------------------------

    title = ""

    if soup.title:
        title = soup.title.get_text(
            strip=True
        )

    if not title:
        title = url

    # --------------------------------
    # EXTRACT TEXT
    # --------------------------------

    text = soup.get_text(
        separator="\n"
    )

    # Clean empty lines
    lines = []

    for line in text.splitlines():

        line = line.strip()

        if line:
            lines.append(line)

    clean_text = "\n".join(lines)

    # --------------------------------
    # VALIDATE CONTENT
    # --------------------------------

    if not clean_text.strip():

        raise ValueError(
            "Could not extract readable text from this website."
        )

    # --------------------------------
    # CREATE LANGCHAIN DOCUMENT
    # --------------------------------

    document = Document(
        page_content=clean_text,

        metadata={
            "file_name": url,
            "source": url,
            "source_type": "website",
            "title": title,
            "url": url,
        }
    )

    print(
        f"Website loaded successfully: {title}"
    )

    print(
        f"Extracted characters: {len(clean_text)}"
    )

    return [document]