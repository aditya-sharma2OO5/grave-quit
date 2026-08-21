from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def retrieve_similar_entries(query: str, history: List[str], top_k: int = 3) -> List[str]:
    """
    RAG-style retrieval: finds the most semantically similar past entries 
    to a given query using lightweight TF-IDF cosine similarity.
    
    query: The current context (e.g., the user's current quit reason)
    history: List of the user's historical quit reasons
    top_k: Number of similar entries to retrieve
    """
    if not history:
        return []
        
    # We include the query as the first item in the corpus to vectorize them all together in the same space
    corpus = [query] + history
    
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform(corpus)
    except ValueError:
        # Happens if vocab is empty (e.g., all stop words)
        return history[:top_k]
        
    # Calculate cosine similarity of query (index 0) against all history (indices 1 to N)
    query_vector = tfidf_matrix[0:1]
    history_vectors = tfidf_matrix[1:]
    
    similarities = cosine_similarity(query_vector, history_vectors)[0]
    
    # Get indices of top_k most similar items
    # argsort sorts ascending, so we take from the end and reverse
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    
    # Filter out entries that have exactly 0 similarity if desired, 
    # but for RAG we often just return the top_k anyway.
    results = []
    for idx in top_indices:
        # We can add a threshold e.g., if similarities[idx] > 0.05
        results.append(history[idx])
        
    return results

if __name__ == "__main__":
    mock_history = [
        "the math got way too advanced",
        "couldnt keep up with the weekly assignments",
        "no time due to exams",
        "the calculus equations were too hard",
        "too busy with my other classes",
        "lost interest in the topic",
        "too much homework every week"
    ]
    
    query = "i was struggling with the advanced calculus and derivations"
    
    print(f"Query: {query}\n")
    print("Top retrieved similar entries from history:")
    retrieved = retrieve_similar_entries(query, mock_history, top_k=2)
    for r in retrieved:
        print(f" - {r}")
