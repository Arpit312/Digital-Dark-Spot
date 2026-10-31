from datetime import date
from backend.app.algorithms.trust import compute_trust_score, get_domain_tier
from backend.app.algorithms.normalize import normalize_date, normalize_amount, normalize_percentage, normalize_document_set
from backend.app.algorithms.freshness import compute_freshness
from backend.app.algorithms.conflict_math import check_numeric_or_date_conflict, check_jaccard_set_conflict
from backend.app.algorithms.gap_math import compute_attribute_gap_score, compute_overall_coverage, compute_dark_spot_index
from backend.app.algorithms.priority import compute_item_priority, bucket_priority, mmr_rerank
from backend.app.algorithms.quote_verify import normalized_levenshtein_similarity, find_best_quote_match

def test_f1_trust_score():
    tier_gov = get_domain_tier("scholarships.gov.in")
    assert tier_gov == 1.0
    
    t_perfect = compute_trust_score("scholarships.gov.in", authority_fraction=1.0, freshness=1.0, total_chars=1000, cleaned_chars=1000)
    assert t_perfect == 1.0

    tier_blog = get_domain_tier("myblog.wordpress.com")
    assert tier_blog == 0.3

def test_f3_normalization_amounts():
    assert normalize_amount("₹1.5 lakh")["value"] == 150000
    assert normalize_amount("2.5 Crore")["value"] == 25000000
    assert normalize_amount("Rs. 50,000")["value"] == 50000

def test_f3_normalization_dates():
    d1 = normalize_date("15/11/2025")
    assert d1["iso"] == "2025-11-15"
    assert d1["inferred"] is False

    d2 = normalize_date("15 November", default_year=2026)
    assert d2["iso"] == "2026-11-15"
    assert d2["inferred"] is True

def test_f3_normalization_documents():
    docs = ["Income Certificate", "Aadhaar Card", "Marksheet ", "Domicile Certificate"]
    norm = normalize_document_set(docs)
    assert "aadhaar" in norm
    assert "income certificate" in norm
    assert "domicile" in norm
    assert "marksheet" in norm

def test_f7_freshness_decay_and_expiry():
    today = date(2026, 10, 31)
    
    res_expired = compute_freshness(
        attribute="deadline",
        deadline_date_str="2026-09-15",
        reference_date=today
    )
    assert res_expired["is_outdated"] is True
    
    res_fresh = compute_freshness(
        attribute="deadline",
        deadline_date_str="2026-12-15",
        published_date_str="2026-10-25",
        reference_date=today
    )
    assert res_fresh["is_outdated"] is False
    assert res_fresh["freshness"] > 0.80

def test_f6_conflict_math():
    conf = check_numeric_or_date_conflict(
        val1="2025-11-15",
        val2="2025-12-31",
        attr_weight=1.0,
        trust1=1.0,
        trust2=0.5
    )
    assert conf is not None
    assert conf["is_conflict"] is True
    assert conf["severity"] > 0.0

    list1 = ["income certificate", "aadhaar"]
    list2 = ["income affidavit", "aadhaar"]
    j_conf = check_jaccard_set_conflict(list1, list2, attr_weight=0.9, trust1=0.8, trust2=0.5)
    assert j_conf is not None
    assert j_conf["is_conflict"] is True
    assert "income certificate" in j_conf["symmetric_difference"]
    assert "income affidavit" in j_conf["symmetric_difference"]

def test_f5_gap_and_dark_spot_index():
    gap_scores = {"deadline": 0.0, "eligibility": 0.0, "documents": 0.0}
    weights = {"deadline": 1.0, "eligibility": 0.9, "documents": 0.9}
    cov = compute_overall_coverage(gap_scores, weights)
    assert cov == 1.0
    assert compute_dark_spot_index(cov) == 0.0

    gap_scores_missing = {"deadline": 1.0, "eligibility": 0.0}
    weights_missing = {"deadline": 1.0, "eligibility": 1.0}
    cov_missing = compute_overall_coverage(gap_scores_missing, weights_missing)
    assert cov_missing == 0.5
    assert compute_dark_spot_index(cov_missing) == 0.5

def test_f11_priority_and_mmr():
    p_high = compute_item_priority(attribute_importance=1.0, confidence=0.2, days_to_deadline=1)
    assert bucket_priority(p_high) == "High"

    items = [
        {"action": "Verify income certificate requirement with official notice", "priority_score": 0.9},
        {"action": "Verify income certificate requirement on official portal", "priority_score": 0.85},
        {"action": "Check renewal policy for second year students", "priority_score": 0.7}
    ]
    reranked = mmr_rerank(items, lambda_param=0.7, top_k=2)
    assert len(reranked) == 2
    assert any("renewal" in item["action"].lower() for item in reranked)

def test_f2_quote_verification():
    source_text = "The last date for online submission of application form is 15th November 2026."
    
    sim_exact, _ = find_best_quote_match("15th November 2026", source_text)
    assert sim_exact == 1.0
    
    sim_fake, _ = find_best_quote_match("Students must submit hard copy to regional center by December", source_text)
    assert sim_fake < 0.60
