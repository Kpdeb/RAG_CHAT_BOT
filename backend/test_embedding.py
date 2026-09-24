from embedding import embedding_model


print("Testing embedding...")

result = embedding_model.embed_query(
    "What is hashing in data structure?"
)

print("Embedding generated successfully.")

print("Vector length:", len(result))