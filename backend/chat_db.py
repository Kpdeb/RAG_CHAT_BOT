import sqlite3
import json
import os
from datetime import datetime


# =========================================================
# DATABASE PATH
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DB_PATH = os.path.join(
    BASE_DIR,
    "chat_history.db"
)


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_connection():

    return sqlite3.connect(
        DB_PATH,
        check_same_thread=False
    )


# =========================================================
# INITIALIZE DATABASE
# =========================================================

def init_db():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            sources TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(chat_id)
                REFERENCES chats(id)
        )
    """)

    conn.commit()
    conn.close()


# =========================================================
# CREATE CHAT
# =========================================================

def create_chat(title="New Chat"):

    conn = get_connection()
    cursor = conn.cursor()

    now = datetime.now().isoformat()

    cursor.execute(
        """
        INSERT INTO chats
        (title, created_at, updated_at)
        VALUES (?, ?, ?)
        """,
        (
            title,
            now,
            now
        )
    )

    chat_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return chat_id


# =========================================================
# GET ALL CHATS
# =========================================================

def get_chats():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            title,
            created_at,
            updated_at
        FROM chats
        ORDER BY updated_at DESC
        """
    )

    rows = cursor.fetchall()

    conn.close()

    chats = []

    for row in rows:

        chats.append({
            "id": row[0],
            "title": row[1],
            "created_at": row[2],
            "updated_at": row[3]
        })

    return chats


# =========================================================
# ADD MESSAGE
# =========================================================

def add_message(
    chat_id,
    role,
    content,
    sources=None
):

    conn = get_connection()
    cursor = conn.cursor()

    now = datetime.now().isoformat()

    sources_json = json.dumps(
        sources or []
    )

    cursor.execute(
        """
        INSERT INTO messages
        (
            chat_id,
            role,
            content,
            sources,
            created_at
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            chat_id,
            role,
            content,
            sources_json,
            now
        )
    )

    cursor.execute(
        """
        UPDATE chats
        SET updated_at = ?
        WHERE id = ?
        """,
        (
            now,
            chat_id
        )
    )

    conn.commit()
    conn.close()


# =========================================================
# GET MESSAGES
# =========================================================

def get_messages(chat_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            role,
            content,
            sources,
            created_at
        FROM messages
        WHERE chat_id = ?
        ORDER BY id ASC
        """,
        (chat_id,)
    )

    rows = cursor.fetchall()

    conn.close()

    messages = []

    for row in rows:

        role = row[0]
        content = row[1]
        sources = row[2]

        try:

            sources = json.loads(
                sources
            )

        except Exception:

            sources = []

        messages.append({
            "role": role,
            "content": content,
            "sources": sources,
            "created_at": row[3]
        })

    return messages


# =========================================================
# UPDATE CHAT TITLE
# =========================================================

def update_chat_title(
    chat_id,
    title
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE chats
        SET title = ?
        WHERE id = ?
        """,
        (
            title,
            chat_id
        )
    )

    conn.commit()
    conn.close()


# =========================================================
# DELETE CHAT
# =========================================================

def delete_chat(chat_id):

    conn = get_connection()
    cursor = conn.cursor()

    # Delete messages first
    cursor.execute(
        """
        DELETE FROM messages
        WHERE chat_id = ?
        """,
        (chat_id,)
    )

    # Delete chat
    cursor.execute(
        """
        DELETE FROM chats
        WHERE id = ?
        """,
        (chat_id,)
    )

    conn.commit()
    conn.close()