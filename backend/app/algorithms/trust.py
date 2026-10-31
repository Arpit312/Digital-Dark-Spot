from typing import List, Optional
from urllib.parse import urlparse

def get_domain_tier(url_or_domain: str) -> float:
    """
    Computes domain tier D:
    .gov.in / .nic.in = 1.0
    .edu / .ac.in = 0.8
    news domains = 0.6
    blog / coaching / other = 0.3 or 0.2
    """
    if not url_or_domain:
        return 0.2
    
    domain = urlparse(url_or_domain).netloc.lower() if "://" in url_or_domain else url_or_domain.lower()
    
    if domain.endswith(".gov.in") or domain.endswith(".nic.in") or ".gov." in domain:
        return 1.0
    elif domain.endswith(".edu") or domain.endswith(".ac.in") or ".edu." in domain:
        return 0.8
    
    news_keywords = ["timesofindia", "ndtv", "thehindu", "indianexpress", "hindustantimes", "jagran", "livemint", "news18", "zee"]
    if any(k in domain for k in news_keywords):
        return 0.6
        
    blog_keywords = ["blog", "wordpress", "medium", "scholarshipportal", "buddy4study"]
    if any(k in domain for k in blog_keywords):
        return 0.3
        
    return 0.2

def compute_trust_score(
    domain_or_url: str,
    authority_fraction: float = 0.0,
    freshness: float = 1.0,
    total_chars: int = 1000,
    cleaned_chars: int = 800
) -> float:
    """
    F1 Trust Score Formula:
    T(s) = 0.40 * D + 0.20 * A + 0.25 * F + 0.15 * Q
    where Q = 1 - (removed_chars / total_chars) = cleaned_chars / total_chars
    """
    D = get_domain_tier(domain_or_url)
    A = max(0.0, min(1.0, authority_fraction))
    F = max(0.0, min(1.0, freshness))
    
    if total_chars > 0:
        Q = max(0.0, min(1.0, cleaned_chars / total_chars))
    else:
        Q = 0.5
        
    T = 0.40 * D + 0.20 * A + 0.25 * F + 0.15 * Q
    return round(float(T), 4)
