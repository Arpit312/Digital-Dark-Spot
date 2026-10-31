# DarkSpot Atlas – Research, Data aur Training Resources

*Ye doc project ke research links, data sources aur AI training/build resources ka alag collection hai.*

> **Note:** Links main domains ke hain jo stable hain. Submission se pehle har link ek baar khol kar check kar lo (kabhi-kabhi page structure badal jaata hai). Jis cheez ka exact page yaad nahi tha, wahan main site diya hai.

## 1. Problem Research (Government / Grievance / Scholarship side)

| Resource | Link | Kaam kahan aayega |
| --- | --- | --- |
| CPGRAMS (Centralised Public Grievance portal) | https://pgportal.gov.in | Problem evidence: siloed portals, grievance flow |
| DARPG (grievance reforms, circulars) | https://darpg.gov.in | Grievance guidelines, circulars |
| National Scholarship Portal (NSP) | https://scholarships.gov.in | Real demo source: scholarship pages, FAQs, citizen charter |
| Digital India | https://www.digitalindia.gov.in | Context: CSC, digital access |
| Common Services Centres (CSC) | https://csc.gov.in | Low-bandwidth / assisted mode ka basis |
| MyGov | https://www.mygov.in | Citizen engagement context |
| India Code (laws database) | https://www.indiacode.nic.in | Acts, rules (supersession graph ke liye) |
| e-Gazette of India | https://egazette.gov.in | Official notifications, effective dates |
| MeitY (DPDP Act 2023 ke liye) | https://www.meity.gov.in | Privacy compliance, anonymisation, k-anonymity |
| Bhashini (Indian language AI) | https://bhashini.gov.in | Hindi/regional translation, voice |

## 2. Demo Data (Real public sources jo analysis mein use kar sakte ho)

| Source | Link | Use |
| --- | --- | --- |
| NSP guidelines, FAQs, citizen charter PDFs | https://scholarships.gov.in | Stale-info test (purane citizen charter mein purani month/deadline) |
| Open Government Data Platform India | https://data.gov.in | Public datasets |
| State scholarship portals (apne state ka) | state ka official portal | Conflict demo: state vs central |
| Wayback Machine (purane page versions) | https://web.archive.org | **Outdated vs updated** page ka real example banane ke liye |
| Common Crawl | https://commoncrawl.org | Bada web text data (optional) |

**Tip:** demo ke liye 5-6 sources ka ek fixed "scholarship pack" bana lo: 1 official page, 1 official PDF, 1 FAQ, 1 blog, 1 coaching page, 1 purana page (Wayback se). Isse gap, conflict aur outdated teeno ek hi demo mein dikhenge. Synthetic content ko clearly "Sample" label karo.

## 3. AI Research Papers (Concepts jo project use karta hai)

| Topic | Paper / Resource | Link |
| --- | --- | --- |
| RAG | Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks | https://arxiv.org/abs/2005.11401 |
| Self-RAG (model khud check kare) | Self-RAG: Learning to Retrieve, Generate, and Critique | https://arxiv.org/abs/2310.11511 |
| Hallucination reduction | Chain-of-Verification Reduces Hallucination in LLMs | https://arxiv.org/abs/2309.11495 |
| Fact verification dataset | FEVER: Fact Extraction and VERification | https://arxiv.org/abs/1803.05355 |
| Scientific claim verification | SciFact: Verifying Scientific Claims | https://arxiv.org/abs/2004.14974 |
| Natural Language Inference | MultiNLI | https://arxiv.org/abs/1704.05426 |
| Multi-agent debate | Improving Factuality and Reasoning through Multiagent Debate | https://arxiv.org/abs/2305.14325 |
| Multi-agent framework | AutoGen: Enabling Next-Gen LLM Applications | https://arxiv.org/abs/2308.08155 |
| LLM-as-a-judge | Judging LLM-as-a-Judge with MT-Bench | https://arxiv.org/abs/2306.05685 |
| Lost in the Middle (long context) | Lost in the Middle: How LMs Use Long Contexts | https://arxiv.org/abs/2307.03172 |
| Knowledge graphs + LLM | Unifying LLMs and Knowledge Graphs: A Roadmap | https://arxiv.org/abs/2306.08302 |
| Temporal reasoning | Time-sensitive QA / temporal knowledge (search: *"TimeQA" arXiv*) | https://arxiv.org/abs/2108.06314 |

## 4. Datasets (AI ko train / evaluate karne ke liye)

| Dataset | Kaam | Link |
| --- | --- | --- |
| FEVER | Claim support/refute/not-enough-info | https://fever.ai |
| SciFact | Claim verification with evidence | https://github.com/allenai/scifact |
| MultiNLI / SNLI | Contradiction detection (entailment/contradiction/neutral) | https://huggingface.co/datasets/nyu-mll/multi\_nli |
| XNLI | Cross-lingual contradiction (Hindi included) | https://huggingface.co/datasets/facebook/xnli |
| IndicNLP / AI4Bharat datasets | Hindi/Indian-language NLP | https://ai4bharat.org |
| IndicGLUE | Indian language benchmarks | https://github.com/AI4Bharat/IndicGLUE |
| HotpotQA | Multi-document reasoning | https://hotpotqa.github.io |
| TimeQA / temporal datasets | Outdated vs current info | https://github.com/wenhuchen/Time-Sensitive-QA |
| Hugging Face Datasets hub | Aur datasets search karne ke liye | https://huggingface.co/datasets |

**Custom dataset (sabse zaroori):** apna chhota "gold set" banao: 20-30 scholarship/scheme topics, har ek mein manually likhe gaye gaps/conflicts/outdated labels. Isse accuracy measure hogi (precision/recall of findings), aur judges ko dikha sakte ho ki system evaluate bhi hua hai.

## 5. Models aur Tools (Build karne ke liye)

| Kaam | Tool | Link |
| --- | --- | --- |
| LLM API (agents ke liye) | Anthropic Claude API | https://docs.claude.com |
| Multi-agent orchestration | LangGraph | https://langchain-ai.github.io/langgraph |
| Multi-agent orchestration (alternative) | CrewAI | https://docs.crewai.com |
| Multi-agent (alternative) | AutoGen | https://microsoft.github.io/autogen |
| Embeddings / semantic search | sentence-transformers | https://www.sbert.net |
| Multilingual embeddings | multilingual-e5 / BGE-M3 (Hugging Face) | https://huggingface.co/BAAI/bge-m3 |
| NLI / contradiction model | DeBERTa NLI models (Hugging Face) | https://huggingface.co/models?pipeline\_tag=text-classification&search=nli |
| Vector database | ChromaDB | https://docs.trychroma.com |
| Vector database (alternative) | FAISS | https://github.com/facebookresearch/faiss |
| Web page text extraction | trafilatura | https://trafilatura.readthedocs.io |
| Web scraping | Playwright | https://playwright.dev |
| PDF text extraction | PyMuPDF | https://pymupdf.readthedocs.io |
| OCR (scanned PDFs, Hindi) | Tesseract | https://github.com/tesseract-ocr/tesseract |
| Date parsing / normalization | dateparser | https://dateparser.readthedocs.io |
| Indic translation | IndicTrans2 | https://github.com/AI4Bharat/IndicTrans2 |
| Backend | FastAPI | https://fastapi.tiangolo.com |
| Frontend | Next.js / React | https://nextjs.org |
| Database | PostgreSQL | https://www.postgresql.org |
| Graph (claim / supersession graph) | NetworkX | https://networkx.org |
| Deployment (free tier) | Vercel / Render | https://vercel.com |
| Passkeys (officer login demo) | WebAuthn guide | https://webauthn.guide |

## 6. Learning Resources (AI banana aur train karna seekhne ke liye)

| Topic | Resource | Link |
| --- | --- | --- |
| Prompt engineering | Anthropic prompt engineering guide | https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview |
| RAG banana | LangChain / LlamaIndex RAG tutorials | https://docs.llamaindex.ai |
| NLP basics | Hugging Face NLP Course | https://huggingface.co/learn/nlp-course |
| Fine-tuning | Hugging Face fine-tuning guide | https://huggingface.co/docs/transformers/training |
| LoRA / efficient fine-tuning | PEFT library | https://huggingface.co/docs/peft |
| Agents banana | Anthropic: Building effective agents | https://www.anthropic.com/research/building-effective-agents |
| Evaluation | RAGAS (RAG evaluation) | https://docs.ragas.io |
| Privacy (k-anonymity) | k-anonymity overview | https://en.wikipedia.org/wiki/K-anonymity |

## 7. Training / Fine-tuning ka Practical Plan

1. **Hackathon (kal tak):** fine-tuning mat karo. Prompting + RAG + deterministic code + pre-trained NLI model kaafi hai.
2. **Contradiction check:** pretrained multilingual NLI model (XNLI / MultiNLI par trained) use karo, aur apne gold set par test karo.
3. **Evaluation:** gold set par precision/recall nikalo, Challenger agent ke saath aur bina uske compare karo. Ye result demo mein dikhao.
4. **Future:** apne gold set ko bada karke Hindi administrative text par chhota fine-tune (LoRA) karo.

## 8. Honest Note (Research ke baare mein)

- Government-side gap (siloed portals, info missing par grievance wapas) ka evidence CPGRAMS aur DARPG ke public material se liya ja sakta hai; exact statistics cite karne se pehle original page khol kar verify karo.
- "Aisa tool nahi mila" ka matlab sirf ye hai ki hamari search mein nahi mila. "Duniya ka pehla" claim mat karo.
- Jo bhi papers/links final submission mein cite karo, unhe ek baar khud khol kar confirm kar lena.
