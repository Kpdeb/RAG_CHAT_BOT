import os
import tempfile

import streamlit as st

from document_loader.loader import (
    load_file,
    load_url
)

from chroma import (
    add_documents,
    get_document_count
)

from rag_pipeline import (
    ask_question
)

from chat_db import (
    init_db,
    create_chat,
    get_chats,
    get_messages,
    add_message,
    update_chat_title
)


# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="AI Knowledge Assistant",
    page_icon="🧠",
    layout="wide"
)


# ============================================================
# INITIALIZE DATABASE
# ============================================================

init_db()


# ============================================================
# SESSION STATE
# ============================================================

if "chat_id" not in st.session_state:

    chats = get_chats()

    if chats:

        st.session_state.chat_id = chats[0][0]

    else:

        st.session_state.chat_id = create_chat(
            "New Chat"
        )


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    # ========================================================
    # ADD KNOWLEDGE
    # ========================================================

    st.header("📚 Add Knowledge")

    # ========================================================
    # UPLOAD DOCUMENTS
    # ========================================================

    st.subheader("📄 Upload Documents")

    uploaded_files = st.file_uploader(

        "Upload documents",

        type=[
            "pdf",
            "docx",
            "txt",
            "csv",
            "md"
        ],

        accept_multiple_files=True,

        label_visibility="collapsed"
    )

    # ========================================================
    # PROCESS UPLOADED FILES
    # ========================================================

    if uploaded_files:

        if st.button(
            "📥 Process Files",
            use_container_width=True
        ):

            all_documents = []

            progress_bar = st.progress(0)

            status = st.empty()

            total_files = len(
                uploaded_files
            )

            for index, uploaded_file in enumerate(
                uploaded_files
            ):

                status.write(
                    f"Processing **{uploaded_file.name}**..."
                )

                temp_path = None

                try:

                    # ----------------------------------------
                    # CREATE TEMPORARY FILE
                    # ----------------------------------------

                    suffix = os.path.splitext(
                        uploaded_file.name
                    )[1]

                    with tempfile.NamedTemporaryFile(
                        delete=False,
                        suffix=suffix
                    ) as temp_file:

                        temp_file.write(
                            uploaded_file.getbuffer()
                        )

                        temp_path = temp_file.name

                    # ----------------------------------------
                    # LOAD DOCUMENT
                    # ----------------------------------------

                    documents = load_file(
                        temp_path
                    )

                    # ----------------------------------------
                    # ADD ORIGINAL FILE NAME
                    # ----------------------------------------

                    for document in documents:

                        document.metadata[
                            "file_name"
                        ] = uploaded_file.name

                        document.metadata[
                            "source"
                        ] = uploaded_file.name

                        document.metadata[
                            "type"
                        ] = "file"

                    all_documents.extend(
                        documents
                    )

                except Exception as e:

                    st.error(
                        f"❌ Error processing "
                        f"{uploaded_file.name}: {e}"
                    )

                finally:

                    # ----------------------------------------
                    # DELETE TEMP FILE
                    # ----------------------------------------

                    if (
                        temp_path
                        and os.path.exists(temp_path)
                    ):

                        os.remove(
                            temp_path
                        )

                progress_bar.progress(
                    (index + 1) / total_files
                )

            status.empty()

            # =================================================
            # ADD DOCUMENTS TO CHROMA
            # =================================================

            if all_documents:

                with st.spinner(
                    "Creating embeddings and updating knowledge base..."
                ):

                    chunks_added = add_documents(
                        all_documents
                    )

                st.success(
                    f"✅ {len(uploaded_files)} "
                    f"file(s) processed."
                )

                st.info(
                    f"📦 {chunks_added} chunks added."
                )

            else:

                st.warning(
                    "⚠️ No documents were processed."
                )

    # ========================================================
    # SEPARATOR
    # ========================================================

    st.divider()

    # ========================================================
    # ADD WEBSITE
    # ========================================================

    st.subheader("🌐 Add Website")

    url = st.text_input(
        "Enter website URL",

        placeholder="https://example.com",

        label_visibility="collapsed"
    )

    if st.button(
        "➕ Add URL",
        use_container_width=True
    ):

        if not url.strip():

            st.warning(
                "⚠️ Please enter a URL."
            )

        else:

            with st.spinner(
                "Reading webpage..."
            ):

                try:

                    # ----------------------------------------
                    # LOAD WEBSITE
                    # ----------------------------------------

                    documents = load_url(
                        url.strip()
                    )

                    # ----------------------------------------
                    # ADD URL METADATA
                    # ----------------------------------------

                    for document in documents:

                        document.metadata[
                            "source"
                        ] = url.strip()

                        document.metadata[
                            "type"
                        ] = "web"

                    # ----------------------------------------
                    # ADD TO CHROMA
                    # ----------------------------------------

                    chunks_added = add_documents(
                        documents
                    )

                    st.success(
                        "✅ Website added "
                        "to knowledge base."
                    )

                    st.info(
                        f"📦 {chunks_added} chunks added."
                    )

                except Exception as e:

                    st.error(
                        f"❌ Could not process URL: {e}"
                    )

    # ========================================================
    # KNOWLEDGE BASE STATUS
    # ========================================================

    st.divider()

    st.subheader("📊 Knowledge Base")

    try:

        count = get_document_count()

        st.metric(
            "Stored Chunks",
            count
        )

    except Exception:

        st.metric(
            "Stored Chunks",
            0
        )

    # ========================================================
    # CHAT HISTORY
    # ========================================================

    st.divider()

    st.header("💬 Chat History")

    # ========================================================
    # NEW CHAT
    # ========================================================

    if st.button(
        "➕ New Chat",
        use_container_width=True
    ):

        new_chat_id = create_chat(
            "New Chat"
        )

        st.session_state.chat_id = (
            new_chat_id
        )

        st.rerun()

    # ========================================================
    # PREVIOUS CHATS
    # ========================================================

    chats = get_chats()

    if chats:

        for chat in chats:

            chat_id = chat[0]

            title = chat[1]

            # ----------------------------------------------
            # CURRENT CHAT
            # ----------------------------------------------

            if (
                chat_id ==
                st.session_state.chat_id
            ):

                button_label = (
                    f"🟣 {title}"
                )

            else:

                button_label = (
                    f"💬 {title}"
                )

            # ----------------------------------------------
            # CHAT BUTTON
            # ----------------------------------------------

            if st.button(
                button_label,

                key=f"chat_{chat_id}",

                use_container_width=True
            ):

                st.session_state.chat_id = (
                    chat_id
                )

                st.rerun()

    else:

        st.caption(
            "No previous conversations."
        )


# ============================================================
# MAIN PAGE
# ============================================================

st.title(
    "🧠 AI Knowledge Assistant"
)

st.caption(
    "Ask questions about your documents "
    "and websites using RAG."
)


# ============================================================
# CURRENT CHAT
# ============================================================

messages = get_messages(
    st.session_state.chat_id
)


# ============================================================
# DISPLAY CHAT HISTORY
# ============================================================

for message in messages:

    role = message["role"]

    content = message["content"]

    sources = message.get(
        "sources",
        []
    )

    # ========================================================
    # CHAT MESSAGE
    # ========================================================

    with st.chat_message(role):

        st.markdown(
            content
        )

        # ====================================================
        # SOURCES
        # ====================================================

        if (
            role == "assistant"
            and sources
        ):

            with st.expander(
                "📚 Sources"
            ):

                displayed = set()

                for source in sources:

                    source_name = source.get(
                        "source",
                        "Unknown"
                    )

                    page = source.get(
                        "page"
                    )

                    source_type = source.get(
                        "type",
                        "unknown"
                    )

                    key = (
                        source_name,
                        page
                    )

                    # ----------------------------------------
                    # REMOVE DUPLICATES
                    # ----------------------------------------

                    if key in displayed:

                        continue

                    displayed.add(
                        key
                    )

                    # ----------------------------------------
                    # PDF / PAGE SOURCE
                    # ----------------------------------------

                    if page is not None:

                        st.write(
                            f"📄 **{source_name}** "
                            f"— Page {page + 1}"
                        )

                    # ----------------------------------------
                    # WEBSITE SOURCE
                    # ----------------------------------------

                    elif source_type == "web":

                        st.write(
                            f"🌐 **{source_name}**"
                        )

                    # ----------------------------------------
                    # OTHER FILE
                    # ----------------------------------------

                    else:

                        st.write(
                            f"📎 **{source_name}**"
                        )


# ============================================================
# CHAT INPUT
# ============================================================

question = st.chat_input(
    "Ask anything about your knowledge base..."
)


# ============================================================
# PROCESS QUESTION
# ============================================================

if question:

    question = question.strip()

    # ========================================================
    # DISPLAY USER QUESTION
    # ========================================================

    with st.chat_message("user"):

        st.markdown(
            question
        )

    # ========================================================
    # SAVE USER MESSAGE
    # ========================================================

    add_message(

        chat_id=st.session_state.chat_id,

        role="user",

        content=question,

        sources=[]
    )

    # ========================================================
    # GENERATE AI RESPONSE
    # ========================================================

    with st.chat_message("assistant"):

        with st.spinner(
            "🔎 Searching knowledge base..."
        ):

            try:

                result = ask_question(
                    question
                )

                # --------------------------------------------
                # GET ANSWER
                # --------------------------------------------

                answer = result.get(
                    "answer",
                    "I could not find an answer."
                )

                # --------------------------------------------
                # GET SOURCES
                # --------------------------------------------

                sources = result.get(
                    "sources",
                    []
                )

                # --------------------------------------------
                # DISPLAY ANSWER
                # --------------------------------------------

                st.markdown(
                    answer
                )

                # =================================================
                # DISPLAY SOURCES
                # =================================================

                if sources:

                    with st.expander(
                        "📚 Sources"
                    ):

                        displayed = set()

                        for source in sources:

                            source_name = source.get(
                                "source",
                                "Unknown"
                            )

                            page = source.get(
                                "page"
                            )

                            source_type = source.get(
                                "type",
                                "unknown"
                            )

                            key = (
                                source_name,
                                page
                            )

                            if key in displayed:

                                continue

                            displayed.add(
                                key
                            )

                            # -----------------------------
                            # PAGE SOURCE
                            # -----------------------------

                            if page is not None:

                                st.write(
                                    f"📄 **{source_name}** "
                                    f"— Page {page + 1}"
                                )

                            # -----------------------------
                            # WEBSITE
                            # -----------------------------

                            elif source_type == "web":

                                st.write(
                                    f"🌐 **{source_name}**"
                                )

                            # -----------------------------
                            # OTHER
                            # -----------------------------

                            else:

                                st.write(
                                    f"📎 **{source_name}**"
                                )

                # =================================================
                # SAVE ASSISTANT RESPONSE
                # =================================================

                add_message(

                    chat_id=st.session_state.chat_id,

                    role="assistant",

                    content=answer,

                    sources=sources
                )

                # =================================================
                # UPDATE CHAT TITLE
                # =================================================

                current_messages = get_messages(
                    st.session_state.chat_id
                )

                user_messages = [

                    message

                    for message in current_messages

                    if message["role"] == "user"

                ]

                # First question becomes chat title

                if len(user_messages) == 1:

                    title = question

                    # --------------------------------------------
                    # Limit title length
                    # --------------------------------------------

                    if len(title) > 40:

                        title = (
                            title[:40]
                            + "..."
                        )

                    update_chat_title(

                        st.session_state.chat_id,

                        title
                    )

            except Exception as e:

                st.error(
                    f"❌ Error while answering: {e}"
                )