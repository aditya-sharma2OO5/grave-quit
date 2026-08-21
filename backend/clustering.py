from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from collections import defaultdict

def cluster_reasons(reasons: List[str], num_clusters: int = 3) -> Dict[str, List[str]]:
    """
    Groups free-text quit reasons into semantic clusters using TF-IDF and K-Means.
    This helps find hidden trends beyond the standard 5 tags.
    """
    if not reasons:
        return {}
        
    # If we have fewer reasons than requested clusters, just group them all or adjust k
    n_samples = len(reasons)
    if n_samples < num_clusters:
        num_clusters = max(1, n_samples)

    # 1. Convert text to TF-IDF vectors
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        X = vectorizer.fit_transform(reasons)
    except ValueError:
        # Happens if all words are stop words or vocabulary is empty
        return {"Cluster 1": reasons}

    # 2. Run K-Means clustering
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init='auto')
    labels = kmeans.fit_predict(X)

    # 3. Group reasons by their cluster label
    clusters = defaultdict(list)
    for reason, label in zip(reasons, labels):
        clusters[f"Cluster {label + 1}"].append(reason)
        
    return dict(clusters)

if __name__ == "__main__":
    # Test the clustering with some mock reasons
    mock_reasons = [
        "the math got way too advanced",
        "couldnt keep up with the weekly assignments",
        "no time due to exams",
        "the calculus equations were too hard",
        "too busy with my other classes",
        "lost interest in the topic",
        "did not care anymore",
        "too much homework every week"
    ]
    
    result = cluster_reasons(mock_reasons, num_clusters=3)
    for cluster_name, items in result.items():
        print(f"--- {cluster_name} ---")
        for item in items:
            print(f"  - {item}")
