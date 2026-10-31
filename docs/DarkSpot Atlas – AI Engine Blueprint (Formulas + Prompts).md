# DarkSpot Atlas – AI Engine Blueprint

*Har feature ka data, algorithm, mathematical formula aur Anti-gravity ke liye ready prompt.*

## 0. Kaise use karna hai

1. Pehle **Master Prompt** (neeche) Anti-gravity mein ek baar daalo. Isse project ka stack aur rules set ho jaate hain.
2. Phir ek-ek feature ka **"Anti-gravity Prompt"** copy karke daalo, same order mein (F1 → F18).
3. Har feature ke formulas code mein exactly waise hi implement honge jaise likhe hain. Isliye prompt mein formula diya hai.

### Honest note (neural network ke baare mein)

Hackathon mein poora model scratch se train karna na possible hai na zaroori. Sahi tareeka: **pretrained neural networks** (embeddings, cross-encoder, NLI) use karo, aur **ek chhota apna neural network (Finding Confidence Net, F10)** apne gold dataset par train karo. Ye real, defendable aur fast hai.

### Real-time kaise

- Agents parallel chalte hain (`asyncio.gather`), results **SSE/WebSocket** se stream hote hain.
- Embeddings aur extraction **content-hash** par cache hote hain (same page dobara process nahi hota).
- Latency budget: ingestion 3s, extraction 6s, compare 2s, audit 2s, total target < 15s for 6 sources.

## 1. Master Prompt (pehle ye daalo)

```
You are building "DarkSpot Atlas": a multi-agent AI platform that analyses multiple sources about a topic and finds information gaps, conflicts, outdated info, and unanswered questions, with evidence for every finding.

Stack: Python 3.11 + FastAPI (async) backend, PostgreSQL + pgvector (or ChromaDB), NetworkX for graphs, sentence-transformers / transformers (PyTorch), Next.js frontend. Use an LLM API only for extraction and explanation, never for numeric/date comparison.

Hard rules:
1. Every finding MUST carry evidence: source_id, exact quote, location. No evidence = finding is blocked.
2. Numbers, dates, amounts are compared by deterministic code, not by LLM.
3. If evidence is insufficient, return status="not_found_in_reviewed_sources" (abstain), never guess.
4. All AI findings are labelled "potential" with a confidence in [0,1].
5. Use real data only (user URLs, uploaded PDFs, fetched pages). Sample data must be labelled "SAMPLE".
6. Agents run in parallel with asyncio, stream progress over SSE, cache by content SHA-256.
7. Implement every formula exactly as specified in each feature prompt, and add unit tests for each formula.
Keep code modular: /agents, /algorithms, /models, /api, /tests. Build step by step; I will give feature prompts one at a time.
```

## 2. Feature-wise AI Engine

### F1. Source Ingestion + Trust Scoring

**Data:** user URLs, PDFs, pasted text; page metadata (domain, publish/updated date, HTTP headers). **Algorithm:** trafilatura (HTML) + PyMuPDF (PDF) + OCR fallback; domain-tier lookup; rule-based authority.

**Formula (Trust score):**

`T(s) = 0.40·D + 0.20·A + 0.25·F + 0.15·Q`

- `D` domain tier: .gov.in/.nic.in = 1.0, .edu/.ac.in = 0.8, news = 0.6, blog = 0.3, coaching/unknown = 0.2
- `A` authority = fraction of other sources that link to this source (0–1)
- `F` freshness (see F7)
- `Q` content quality = 1 − (boilerplate\_ratio), where boilerplate\_ratio = removed\_chars / total\_chars

```
Implement F1: source ingestion + trust scoring. Fetch URL (httpx async), extract main text with trafilatura, PDFs with PyMuPDF, OCR fallback with pytesseract (eng+hin). Extract publish/updated date from meta tags/text. Store text, SHA-256 hash, domain, dates. Compute trust score exactly: T = 0.40*D + 0.20*A + 0.25*F + 0.15*Q, where D is a domain-tier lookup (gov.in/nic.in=1.0, edu/ac.in=0.8, news=0.6, blog=0.3, other=0.2), A = fraction of other sources linking to it, F = freshness from F7, Q = 1 - removed_chars/total_chars. Cache by hash. Add tests.
```

### F2. Claim Extraction Agent

**Data:** cleaned source text split into 300–500 token chunks with overlap. **Algorithm:** LLM structured extraction (JSON schema: attribute, value, unit, date, quote, location) + regex/NER pre-pass for dates, ₹ amounts, percentages; quote verification by fuzzy match.

**Formulas:**

- Quote verification similarity: `sim(a,b) = 1 − Lev(a,b) / max(|a|,|b|)`; accept claim only if `sim ≥ 0.90` against the source text (kills hallucinated quotes).
- Claim confidence: `p = σ(w1·mean_logprob + w2·regex_agree + w3·quote_sim + b)`, where `σ(x) = 1/(1+e^{−x})`.

```
Implement F2: claim extraction. Chunk text (400 tokens, 50 overlap). Run regex/NER pre-pass for dates, rupee amounts, percentages. Then call the LLM with a strict JSON schema {attribute, value, unit, date, quote, location}. Verify each claim's quote exists in the source using normalized Levenshtein similarity sim = 1 - Lev(a,b)/max(|a|,|b|); drop claims with sim < 0.90. Compute claim confidence p = sigmoid(w1*mean_logprob + w2*regex_agree + w3*quote_sim + b) with configurable weights. Save claims with provenance. Add tests with a hallucinated-quote case.
```

### F3. Normalization Engine (deterministic)

**Data:** raw claim values. **Algorithm:** dateparser (Hindi + English), unit conversion, canonical forms.

**Rules:** `₹1.5 lakh = 150000`, `"15/11/25" = 2025-11-15`, "Nov 15" without year → year inferred from source cycle, marked `inferred=true`.

```
Implement F3: normalization. Use dateparser (languages hi, en) to convert dates to ISO-8601; if year is missing infer from the source's cycle/publish year and set inferred=true. Convert amounts (lakh=1e5, crore=1e7, Rs/INR symbols) to integers. Normalize percentages and lists (lowercase, strip, lemmatize document names). Return canonical value + original text. Pure functions, 100% unit-tested.
```

### F4. Hybrid Retrieval + Reranking

**Data:** chunk embeddings (BGE-M3 or multilingual-e5), BM25 index. **Algorithm:** BM25 + dense search fused by Reciprocal Rank Fusion, then cross-encoder rerank.

**Formulas:**

- `BM25(q,d) = Σ_t IDF(t) · f(t,d)·(k1+1) / ( f(t,d) + k1·(1 − b + b·|d|/avgdl) )`, `IDF(t) = ln( (N − n_t + 0.5)/(n_t + 0.5) + 1 )`, with `k1=1.5, b=0.75`
- Cosine: `cos(q,d) = (q·d) / (‖q‖·‖d‖)`
- RRF: `RRF(d) = Σ_i 1/(k + rank_i(d))`, `k = 60`

```
Implement F4: hybrid retrieval. Build BM25 (k1=1.5,b=0.75, IDF=ln((N-n+0.5)/(n+0.5)+1)) with rank_bm25 and dense retrieval using BAAI/bge-m3 embeddings in pgvector with cosine similarity. Fuse rankings with Reciprocal Rank Fusion RRF(d)=sum 1/(60+rank_i(d)). Rerank the top 20 with a cross-encoder (BAAI/bge-reranker-v2-m3). Expose retrieve(query, k) async. Add tests that check fusion math on toy data.
```

### F5. Expected-Information Template + Gap Detector

**Data:** topic-type templates (scholarship: eligibility, documents, deadline, apply link, renewal, amount, selection, helpline), extracted claims. **Algorithm:** attribute classification of claims (zero-shot + embedding similarity), coverage computation.

**Formulas:**

- Attribute match: `P(a | claim) = softmax over attributes of cos(emb(claim), emb(attribute_description))/τ`, `τ = 0.05`
- Gap score for attribute a: `G_a = 1 − max_s [ P(a | claim_s) · T(s) ]`
- Potential gap if `G_a > 0.6`
- Overall coverage: `C = Σ_a w_a·(1 − G_a) / Σ_a w_a` (w\_a = attribute importance, e.g., deadline = 1.0, helpline = 0.3)

```
Implement F5: gap detection. Define topic templates as JSON (attribute, description, importance w_a). For each claim compute P(a|claim)=softmax_a(cos(emb(claim),emb(desc_a))/0.05). Gap score G_a = 1 - max over sources of P(a|claim_s)*T(s). Flag potential_gap when G_a>0.6. Compute overall coverage C = sum w_a*(1-G_a)/sum w_a. Output per-attribute status (covered/partial/not_found_in_reviewed_sources) with the best evidence if any. Add tests.
```

### F6. Conflict Detector (deterministic + neural)

**Data:** claim pairs with the same attribute, from different sources. **Algorithm:** blocking by attribute (avoids O(n²) over all claims), deterministic compare for numbers/dates/sets, **DeBERTa NLI** neural net for text claims.

**Formulas:**

- Numbers/dates: conflict if `|v1 − v2| > ε` (ε = 0 for dates, 0 for amounts)
- Sets (documents list): `J(A,B) = |A ∩ B| / |A ∪ B|`; conflict if `J < 1` and the symmetric difference contains required items
- Text claims: `P_con = softmax(z)_contradiction` from NLI model, conflict if `P_con ≥ 0.7` in both directions (premise↔hypothesis swap)
- Severity: `Sev = P_con · w_a · (T1 + T2)/2` (for deterministic conflicts P\_con = 1)
- Resolution hint: prefer source with higher T(s) and later date, but always show both

```
Implement F6: conflict detection. Group claims by attribute (blocking). For numbers/dates/amounts use exact deterministic comparison after F3 normalization. For lists use Jaccard J=|A∩B|/|A∪B| and report the symmetric difference. For text claims run a DeBERTa NLI model (MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7) both directions; conflict if P_contradiction>=0.7 in both. Severity = P_con * w_a * (T1+T2)/2. Output both evidence quotes side by side with a resolution hint (higher trust + later date) but never hide either side. Add tests including a Hindi-English pair.
```

### F7. Freshness / Outdated Detector

**Data:** publish/updated date, cycle strings ("2023-24"), deadlines, today's date. **Algorithm:** attribute-specific half-life decay + hard expiry rules.

**Formulas:**

- `F(s,a) = exp(−λ_a·Δt)`, `λ_a = ln(2)/h_a` (half-life: deadline 30 days, documents 365, eligibility 365, helpline 730)
- Outdated if `F < 0.40`
- Hard rule: deadline `< today` → "expired deadline"; cycle regex `(20\d\d)[-–/](\d\d)` earlier than current cycle → "earlier cycle"
- Undated source: `F = 0.5` and flagged "date unknown" (never assume fresh)

```
Implement F7: freshness. Compute F = exp(-lambda_a * delta_days) with lambda_a = ln2 / half_life_a (deadline 30, documents 365, eligibility 365, helpline 730 days). Mark outdated when F<0.40. Add hard rules: deadline earlier than today => expired; regex (20\d\d)[-–/](\d\d) cycle earlier than the current academic cycle => earlier_cycle. Undated sources get F=0.5 and flag date_unknown. Return reason strings with evidence. Add tests with frozen time.
```

### F8. Supersession Graph

**Data:** circulars/orders/GOs, text like "in supersession of", "modifies", "w.e.f." **Algorithm:** relation extraction (regex + LLM) → directed acyclic graph (NetworkX).

**Formulas:**

- Edge `u → v` means u supersedes v, with `effective_date(u)`
- Currently valid document: node with no incoming superseding edge whose `effective_date ≤ today`
- Cycle check by Kahn's topological sort; cycle = data error, flag to user
- Validity score: `V(v) = 0 if superseded else 1`

```
Implement F8: supersession graph with NetworkX DiGraph. Extract relations (supersedes, modifies, withdraws) using regex for phrases like "in supersession of", "w.e.f." plus an LLM fallback; each edge stores effective_date and evidence quote. A node is current iff it has no incoming superseding edge with effective_date<=today. Detect cycles via topological sort and flag them. API: get_current(doc_set), explain_chain(doc). Add tests.
```

### F9. Challenger Agent (adversarial verification)

**Data:** candidate findings (gap/conflict/outdated) + evidence. **Algorithm:** self-consistency voting with k independent verification prompts (different temperatures/phrasings), plus Bayesian update.

**Formulas:**

- Vote ratio: `v = agree / k` (k = 5)
- Bayesian: `logit(p_final) = logit(p_prior) + Σ_i log LR_i`, where `LR_i = P(vote_i | finding true) / P(vote_i | finding false)` (estimated from the gold set: sensitivity/(1−specificity))
- Drop finding if `p_final < 0.4`; mark "uncertain" if between 0.4–0.7

```
Implement F9: Challenger agent. For each finding run k=5 independent verification prompts trying to REFUTE it (e.g. 'is this just a wording difference?', 'is the info present elsewhere in the sources?'). Compute vote ratio v=agree/k. Update confidence with Bayesian log-odds: logit(p_final)=logit(p_prior)+sum(log LR_i) using configurable likelihood ratios. Drop findings with p_final<0.4, label 'uncertain' for 0.4-0.7, 'potential' above 0.7. Run the k calls concurrently with asyncio. Add tests.
```

### F10. Evidence Auditor + Abstain Mode + **Finding Confidence Net (our own neural network)**

**Data:** (finding, evidence snippet) pairs, plus human-labelled gold set (30–50 topics, true/false findings). **Algorithm:** NLI entailment check (does the snippet really support the finding?), temperature scaling calibration, a small MLP that combines all signals into one calibrated confidence, and conformal abstention.

**Formulas:**

- Entailment gate: `P_ent(snippet ⊨ finding) ≥ 0.80`, otherwise **block**
- Input vector: `x = [P_ent, P_con, T, F, sim, v, w_a, G_a]`
- Network: `h1 = ReLU(W1·x + b1)`, `h2 = ReLU(W2·h1 + b2)`, `ŷ = σ(W3·h2 + b3)` (8 → 16 → 8 → 1)
- Loss (binary cross-entropy): `L = −(1/n) Σ [ y·log ŷ + (1−y)·log(1−ŷ) ]`, optimizer Adam, with dropout 0.2 and early stopping
- Calibration: `p = softmax(z/T)` with T learned on validation set; **ECE** `= Σ_m (|B_m|/n)·| acc(B_m) − conf(B_m) |`
- Conformal abstain: nonconformity `s_i = 1 − ŷ_i(true class)` on calibration set; threshold `q̂ = quantile_{⌈(n+1)(1−α)⌉/n}(s)`, α = 0.1. If a finding's score is beyond q̂ → abstain: *"reviewed sources mein nahi mila / uncertain"*

```
Implement F10 in two parts. (A) Evidence auditor: run NLI entailment between evidence snippet and finding statement; block findings with P_ent<0.80. (B) Finding Confidence Net in PyTorch: input x=[P_ent,P_con,T,F,sim,v,w_a,G_a] (8 features), MLP 8->16->8->1, ReLU, dropout 0.2, sigmoid output, BCE loss, Adam lr=1e-3, early stopping. Provide a training script that reads gold_set.jsonl (features + label y), a temperature-scaling step on a validation split, ECE computation, and split-conformal abstention with alpha=0.1 (q = quantile at ceil((n+1)(1-alpha))/n of nonconformity scores). At inference return {confidence, label: sourced_fact|potential|uncertain|abstain}. Ship a small synthetic bootstrap dataset labelled SAMPLE so it runs before real gold data exists. Add tests for ECE and the conformal threshold.
```

### F11. Verify-Next Planner (prioritization)

**Data:** audited findings, deadlines, attribute importance. **Algorithm:** risk-based ranking + diversity.

**Formulas:**

- Priority: `P_i = Impact_i · Uncertainty_i · Urgency_i`
- `Impact = w_a`, `Uncertainty = 1 − ŷ` (or entropy `H = −Σ p·log p`), `Urgency = exp(−days_to_deadline / 14)`
- Diversity (remove near-duplicate checklist items) via **MMR**: `argmax_i [ λ·P_i − (1−λ)·max_{j∈S} cos(i,j) ]`, λ = 0.7
- Buckets: High ≥ 0.6, Medium 0.3–0.6, Low < 0.3

```
Implement F11: Verify-Next planner. Priority P = Impact*Uncertainty*Urgency with Impact=w_a, Uncertainty=1-confidence, Urgency=exp(-days_to_deadline/14) (1.0 if no deadline). Rank, then apply Maximal Marginal Relevance (lambda=0.7, cosine on item embeddings) to remove duplicates. Bucket High>=0.6, Medium 0.3-0.6, Low<0.3. Each checklist item must contain: action text, why (finding id), official link if known, and evidence reference. Add tests.
```

### F12. Gap Heatmap + Coverage Matrix

**Data:** gap scores per attribute and per source. **Formulas:**

- Matrix `M[a][s] = P(a | best claim in s)`; cell colour = `1 − M`
- Per-source completeness: `Comp(s) = Σ_a w_a·M[a][s] / Σ_a w_a`
- Dark spot index of the topic: `DSI = 1 − C` (C from F5)

```
Implement F12: coverage matrix and heatmap API. Build M[a][s]=P(a|best claim in source s). Return cells with colour value 1-M, per-source completeness Comp(s)=sum w_a*M[a][s]/sum w_a and Dark Spot Index DSI=1-C. Frontend: render a grid heatmap (Next.js) where clicking a cell opens the evidence viewer.
```

### F13. Watchtower / Change Radar

**Data:** periodic re-fetch of tracked sources. **Algorithm:** exact hash + near-duplicate fingerprint + sequential change detection.

**Formulas:**

- Exact change: `SHA256(text_t) ≠ SHA256(text_{t−1})`
- SimHash Hamming distance `d_H`; minor edit if `d_H ≤ 3`, meaningful change otherwise
- Claim-level diff: re-run F2–F3 and compare changed attribute values
- CUSUM for spike in change frequency: `S_t = max(0, S_{t−1} + x_t − μ − k)`, alert if `S_t > h`

```
Implement F13: Watchtower. Scheduler (APScheduler) re-fetches tracked URLs. Detect change with SHA-256; classify minor vs meaningful using SimHash Hamming distance (<=3 minor). On meaningful change re-run extraction+normalization and diff claim values per attribute; create alerts like 'deadline changed 15 Nov -> 30 Nov' with before/after evidence. Add CUSUM S_t=max(0,S_{t-1}+x_t-mu-k) for unusual change frequency. Push alerts over SSE. Tests included.
```

### F14. Citizen Confusion Intelligence (officer module)

**Data:** grievance / query text (anonymised), scheme, step, district, timestamp. **Algorithm:** fine-tuned multilingual classifier (XLM-R / IndicBERT) for root cause, embedding clustering for "where confusion happens", anomaly detection.

**Formulas:**

- Root-cause classifier: `P(c | text) = softmax(W·h_CLS)`, classes = {information gap, conflicting info, service failure}; loss = cross-entropy `−Σ y_c log p_c`
- Clustering: HDBSCAN on embeddings; topic labels by **c-TF-IDF**
- Spike detection: EWMA `E_t = α·x_t + (1−α)·E_{t−1}` (α = 0.3), `z_t = (x_t − E_{t−1}) / σ`, alert if `z_t > 3`
- **Privacy:** k-anonymity — hide any cell with count `< k` (k = 10); optional differential privacy `x̃ = x + Laplace(Δ/ε)`

```
Implement F14: confusion intelligence. Classify anonymised query/grievance text into {information_gap, conflicting_info, service_failure} with a Hugging Face sequence classifier head (xlm-roberta-base) trained by cross-entropy; provide training script + synthetic SAMPLE data. Cluster embeddings with HDBSCAN and label clusters with c-TF-IDF. Aggregate by scheme/step/district. Spike detection with EWMA (alpha=0.3) and z-score>3. Privacy: suppress any aggregate cell with count<10 (k-anonymity) and optionally add Laplace noise (epsilon configurable). Never expose raw text to the dashboard. Add tests for suppression.
```

### F15. Authoritative Source Registry + Drift Watch

**Data:** officer-signed key facts (deadline, eligibility, link) + third-party pages. **Algorithm:** digital signature verification, fuzzy page matching, drift detection.

**Formulas:**

- Signature: Ed25519 over `canonical_json(fact)`; dual-approval = 2 distinct valid signatures
- Page relevance: MinHash-estimated Jaccard `Ĵ(A,B) = (1/m) Σ [ h_i(A) = h_i(B) ]` and embedding cosine; match if both exceed threshold
- Drift: after F3 normalization, `value_page ≠ value_signed` → alert with severity = `w_a · T_signed`

```
Implement F15: signed facts registry and drift watch. Store facts {scheme, attribute, value, valid_from, valid_to}; sign canonical JSON with Ed25519 (cryptography lib); require two distinct approver signatures to activate. For third-party pages, find relevant pages via MinHash Jaccard (datasketch) + embedding cosine, extract claims (F2-F3), compare to signed facts and raise a drift alert when values differ, with severity w_a*T_signed. Add a correction-request workflow entity. Immutable audit log table (append-only). Tests included.
```

### F16. Policy Consistency Auditor (officer module)

**Data:** department circulars, GOs, FAQs, portal text, draft circular. **Algorithm:** reuse F2–F8 across a document set; draft-vs-corpus check.

**Formulas:**

- Consistency score: `CS = 1 − (#conflicts / #comparable_pairs)`
- Staleness-of-FAQ: FAQ claim is stale if a newer node supersedes its source in F8
- Draft check: for each claim in the draft, compare with the current (non-superseded) corpus claims; report contradictions before publish

```
Implement F16: policy consistency auditor. Given a document set, run extraction, normalization, conflict detection and supersession graph. Compute CS=1-(#conflicts/#comparable_pairs). Flag FAQ/portal claims whose source is superseded. Draft mode: compare a draft circular's claims against the current corpus and list contradictions, then generate a corrected single-source draft where every sentence cites its evidence. Tests included.
```

### F17. Language Layer + Low-bandwidth Mode

**Data:** user input in Hindi/English/Hinglish. **Algorithm:** language ID (fastText), translation (IndicTrans2), text-only lite responses.

**Formulas:**

- Language ID: `argmax_l P(l | text)` (fastText softmax)
- Payload budget: lite response ≤ 30 KB; compress with gzip/brotli

```
Implement F17: language layer. Detect language with fastText lid.176; translate Hindi<->English via IndicTrans2 (cache results). Keep all internal claims in English with original text preserved; explanations are generated in the user's language. Add lite mode: text-only JSON under 30 KB with brotli compression and no images. Tests included.
```

### F18. Evaluation Suite (judges ko dikhane ke liye)

**Data:** gold set (30–50 topics) with human labels. **Formulas:**

- `Precision = TP/(TP+FP)`, `Recall = TP/(TP+FN)`, `F1 = 2PR/(P+R)`
- Evidence faithfulness: `Faith = (# findings with valid evidence quote) / (# findings)` (target = 1.0)
- Calibration: ECE (see F10)
- Ablation: F1 with and without Challenger/Auditor to prove their value

```
Implement F18: evaluation suite. Load gold_set.jsonl, run the whole pipeline, compute precision, recall, F1 per finding type (gap/conflict/outdated), evidence faithfulness, ECE, and an ablation table (with/without Challenger and Auditor). Output a markdown report and a JSON file the frontend shows on an 'Accuracy' page.
```

## 3. Build Order (jaldi build ke liye)

1. **Day 1 core:** F1 → F2 → F3 → F5 → F6 → F7 → F11 + basic dashboard
2. **Trust layer:** F9 → F10 (auditor first, neural net with SAMPLE data) → F12
3. **Polish for demo:** F4 retrieval, F13 watchtower, F18 accuracy page
4. **Officer demo (thin):** F16 + F8; baaki (F14, F15) roadmap mein, ya sirf UI mock
5. **Last:** F17 language toggle

Judging ke hisaab se ek polished core (F1–F7, F9–F11) officer features se zyada score dilayega.
