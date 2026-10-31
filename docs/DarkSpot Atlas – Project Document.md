# DarkSpot Atlas

*Multi-Agent AI Platform jo batata hai ki aapki jaankari mein kya missing, purana ya contradictory hai*

Shinchan Online Hackathon 2026 · Problem: Digital Dark Spot · Individual Participation

## 1. Project Name

**DarkSpot Atlas** – "Jahan jaankari mein andhera hai, wahan roshni."

Naam ka matlab: *Dark Spot* = woh jagah jahan info missing, purani ya conflicting hai. *Atlas* = un sab dark spots ka ek map.

## 2. Introduction

DarkSpot Atlas ek web-based, AI-powered platform hai jo ek topic ya sawaal (jaise "Scholarship apply karne se pehle kya verify karun?") ke baare mein **kai sources** (official pages, PDFs, blogs, FAQs) ko padhta hai aur batata hai:

- Kaunsi jaankari **missing** hai (information gap)
- Kaunse sources **ek doosre se alag** bol rahe hain (conflict)
- Kaunsi info **purani** ho sakti hai (outdated)
- Kaunse sawaal **unanswered** hain
- Aur user ko **aage kya verify karna chahiye** (prioritized checklist)

Sabse important: har finding ke saath **source reference + exact evidence snippet** milta hai, aur har AI output ko clearly **"Potential Gap"** label kiya jaata hai, "guaranteed fact" nahi. Jahan jawab nahi milta, wahan system andaza nahi lagata, seedha bolta hai: *"Reviewed sources mein nahi mila."*

Ye search engine nahi hai (wo info dhundhta hai), aur summarizer bhi nahi (wo jo mila use chhota karta hai). DarkSpot Atlas **jo nahi mila usse dhundhta hai**.

## 3. Problem Statement

### Ek line mein

> Log online info par bade decisions lete hain, lekin info alag-alag jagah bikhri hoti hai, kuch purani hoti hai, kuch aapas mein contradict karti hai, aur sabse khatarnak: **jo cheez missing hai uska pata hi nahi chalta.** Aaj ka koi tool "kya missing hai" nahi batata. DarkSpot Atlas wahi batata hai.

### Detail mein

Internet par jaankari ki kami nahi hai, **bharose layak aur complete jaankari ki kami hai.** Ek student, kisaan, job-seeker ya researcher jab koi important decision leta hai (scholarship, admission, sarkari yojana, loan), to usse 5-10 websites, PDFs, notices aur blogs dekhne padte hain. Problems:

- **Scattered info:** eligibility ek jagah, documents list doosri jagah, deadline teesri jagah.
- **Outdated info:** coaching sites, blogs aur purane PDFs mein pichle saal ki deadline ya rules chalte rehte hain.
- **Conflicting info:** ek source kehta hai income certificate chahiye, doosra kehta hai nahi.
- **Unknown unknowns:** user ko pata hi nahi ki renewal condition, last date extension ya official apply link bhi dekhna tha.

Sarkari side par bhi yahi gap hai: grievance data mein "service fail hui" aur "jaankari ki kami" mili hui hoti hai, to officers ko pata nahi chalta ki log *kahan* confuse ho rahe hain. Departments ke data silos aur alag-alag portals (state portal, NSP, CPGRAMS) ek hi grievance ko kai jagah resolve karne mein time khaate hain, aur info kam ho to grievance wapas "poori jaankari ke saath dobara file karo" par aa jaati hai.

### Real scenario

**Riya** (Class 12 pass, ghar ki income kam) ek scholarship apply karna chahti hai.

1. Google par search karti hai. Official portal, ek coaching blog aur ek YouTube description milte hain.
2. Official page eligibility batata hai, par **renewal conditions** nahi dikhte.
3. Blog kehta hai *income certificate* chahiye, official PDF kehta hai *income affidavit* bhi chalega. **Conflict.**
4. Ek page par deadline "July" likhi hai, par woh pichle cycle ka page hai. **Outdated.**
5. Riya galat document ke saath apply karti hai, form reject hota hai, aur next cycle tak intezaar karna padta hai.

Riya ne koi galti nahi ki. Uske paas **yeh batane wala koi tool nahi tha ki kya check karna baaki hai.** Yahi "Digital Dark Spot" hai.

## 4. Current Technology ki Limitations aur DarkSpot Atlas ka Fix

| Existing tech | Limitation | DarkSpot Atlas kaise fix karta hai |
| --- | --- | --- |
| **Search engines (Google, Bing)** | Links dete hain, par ye nahi batate ki kya missing ya contradictory hai. Purane aur naye pages same rank par ho sakte hain. | Sources ko ek saath analyse karke gaps, conflicts aur staleness explicitly dikhata hai. |
| **AI chatbots (ChatGPT-style)** | Fluent jawab dete hain par hallucinate kar sakte hain, source evidence hamesha nahi dikhate, aur "mujhe nahi pata" kam bolte hain. Numbers/dates ke conflicts mein LLM kamzor hote hain. | Har claim ke saath source snippet; numbers/dates ka **deterministic code-based comparison**; **Abstain mode**. |
| **Summarizers** | Jo available hai use chhota karte hain, jo missing hai wo nahi batate. | Ek **Expected-Information Checklist** se compare karke missing items nikalta hai. |
| **RAG tools / document Q&A** | Sawaal ka jawab dete hain, par cross-document consistency check nahi karte. | **Claim Graph** banata hai jisme har source ke claims aapas mein compare hote hain. |
| **Fact-checkers** | Ek single claim verify karte hain, poore topic ka gap nahi. | Poore topic ko attribute-by-attribute (deadline, eligibility, documents, renewal) audit karta hai. |
| **Government portals (CPGRAMS, NSP, state portals)** | Siloed data, inconsistent entries, aur grievance data mein "info gap" vs "service failure" alag nahi hota. Citizen ko pata nahi kaunsa page "asli" hai. | **Authoritative Source Registry** + **Citizen Confusion Intelligence** (officer-only, anonymised). |
| **Browser/RSS alerts** | Change aaya ye batate hain, par ye nahi ki isse kaunsa purana source ab galat ho gaya. | **Change Radar + Supersession Graph**: kaunsa order kisko replace karta hai, effective date ke saath. |

**Mool fark:** baaki tools *info lane* par kaam karte hain. DarkSpot Atlas *info ki kami, takraav aur purani cheezein* pakadne par kaam karta hai.

## 5. Solution (Deep Explanation)

### Idea

User ek sawaal deta hai. System sources jama karta hai, har source se **atomic claims** nikalta hai (jaise "Deadline = 15 Nov 2025", "Document = Income certificate"), unhe ek **Claim Graph** mein jodta hai, aur phir teen cheezein check karta hai: *kya missing hai, kya contradict kar raha hai, kya purana hai.*

### Ye kaise kaam karta hai (step-by-step)

1. **Input:** user topic/question likhta hai (Hindi ya English), aur URLs/PDFs add karta hai ya "permitted search results" se auto-retrieve karwata hai.
2. **Source ingestion:** pages/PDFs ka text nikalta hai, publish/updated date, domain type (official / blog / coaching / news) tag karta hai.
3. **Expected-Information Template:** topic ke type (scholarship, admission, scheme, loan) ke hisaab se ek checklist banta hai, jaise scholarship ke liye: eligibility, documents, deadline, apply link, renewal, amount, selection process, helpline. Ye **"kya hona chahiye"** ka blueprint hai.
4. **Claim extraction:** har source se structured claims nikalte hain (attribute, value, date, exact quote, page/location).
5. **Normalization:** dates, amounts, percentages ko standard format mein badla jaata hai ("15/11/25" aur "15 November 2025" = same).
6. **Deterministic comparison (code, LLM nahi):** numbers, dates aur lists ka comparison code se hota hai, kyunki LLM conflicts mein kamzor hote hain.
7. **Semantic comparison (AI):** text claims (eligibility wording) ke liye NLI/LLM check karta hai ki do claims contradict karte hain ya nahi.
8. **Gap detection:** template ke jo attributes kisi source mein nahi mile, woh "Potential Gap" bante hain.
9. **Staleness detection:** source ki date, cycle year ("2023-24"), expired deadline aur supersession graph se purani info flag hoti hai.
10. **Challenger review:** ek alag agent har finding ko todne ki koshish karta hai (false-positive kam karne ke liye).
11. **Output:** dashboard (gaps, conflicts, outdated, unanswered) + prioritized **Verify-Next checklist**.

### Limitations ko kaise cover kiya

- **Hallucination:** har finding ke saath exact evidence snippet; bina evidence ke finding dikhegi hi nahi.
- **Overconfidence:** teen labels: *Sourced Fact*, *AI-Suggested Potential Gap*, *Uncertain*. Confidence score ke saath.
- **"Maine sab dekh liya" ka bharam:** "Reviewed sources" ka scope hamesha dikhta hai: "Is analysis mein 6 sources review hue."
- **LLM ki numeric weakness:** code-based comparison.
- **Purane sources ko galti se sahi maan lena:** supersession graph + date checks.
- **Language barrier:** Hindi/English dono input aur output.
- **Low bandwidth:** lite mode (text-only, kam data).

## 6. AI Multi-Agent Architecture

System mein kai specialised AI agents hain, aur ek **Orchestrator** unhe coordinate karta hai. Har agent ka ek hi kaam hai, isse accuracy badhti hai aur har step auditable rehta hai.

| # | Agent | Role | Input → Output |
| --- | --- | --- | --- |
| 1 | **Orchestrator Agent** | Poora pipeline manage karta hai, agents ko kaam deta hai, retries aur failures handle karta hai. | Question → task plan |
| 2 | **Query Understanding Agent** | Sawaal ka intent aur topic type samajhta hai (scholarship / scheme / admission), Hindi-English mix handle karta hai. | Question → topic type + sub-questions |
| 3 | **Source Scout Agent** | Sources dhundhta ya user ke diye sources ko classify karta hai (official / blog / news / coaching), trust tier deta hai. | Topic → ranked source list |
| 4 | **Extraction Agent** | Har source se structured claims, dates, exact quotes nikalta hai. | Source text → claim records |
| 5 | **Template (Expectation) Agent** | Topic ke liye "kya info honi chahiye" ka blueprint banata hai. | Topic type → expected attributes |
| 6 | **Conflict Detector Agent** | Claims ko aapas mein compare karta hai. Numbers/dates code se, text claims NLI se. | Claim graph → conflicts |
| 7 | **Gap Finder Agent** | Template vs mile hue claims compare karke missing aur unanswered items nikalta hai. | Template + claims → gaps |
| 8 | **Freshness / Change Radar Agent** | Source dates, cycle years, expired deadlines, aur supersession check karta hai. | Claims + dates → outdated flags |
| 9 | **Challenger Agent** | Har finding ko todne ki koshish karta hai ("kya ye sach mein conflict hai ya wording ka fark?"). Weak findings ka confidence kam karta hai ya hata deta hai. | Findings → verified findings |
| 10 | **Evidence Auditor Agent** | Check karta hai ki har finding ke saath valid source snippet hai ya nahi. Bina evidence ki finding block. | Findings → audited findings |
| 11 | **Verify-Next Planner Agent** | Findings ko priority (high/medium/low) ke saath actionable checklist mein badalta hai. | Findings → checklist |
| 12 | **Explainer Agent** | Simple Hindi/English mein samjhata hai, "reviewed sources mein nahi mila" jaisi abstain language use karta hai. | Everything → user-friendly report |

### Agents kaise aapas mein kaam karte hain

```
User Question
   ↓
Orchestrator → Query Understanding → Template Agent (kya hona chahiye)
   ↓
Source Scout → Extraction Agent (claims)
   ↓
┌───────────────┬──────────────┬─────────────────┐
Conflict Detector  Gap Finder   Freshness Agent   (parallel)
└───────────────┴──────────────┴─────────────────┘
   ↓
Challenger Agent (findings ko challenge)
   ↓
Evidence Auditor (evidence nahi to block)
   ↓
Verify-Next Planner → Explainer → Dashboard
```

**Isme khaas kya hai:** ek agent ki galti dusra agent pakadta hai (Challenger + Auditor). Isse single-LLM chatbot ke muqable reliability zyada hoti hai.

## 7. Core Features

1. **Question/Topic input** (Hindi + English)
2. **Multi-source collection:** user URLs, PDF upload, permitted search
3. **Structured Key-Info Summary** (attribute-wise: deadline, eligibility, documents...)
4. **Gap Heatmap:** topic ke kaunse hisse covered, kaunse dark
5. **Conflict Finder:** side-by-side evidence ke saath
6. **Outdated Info Warnings:** date, cycle year aur expired deadline par
7. **Unanswered Questions list**
8. **Evidence Viewer:** har finding par click karke source snippet dekho
9. **Verify-Next Checklist:** priority ke saath, official link ke saath
10. **Trust Labels:** Sourced Fact / Potential Gap / Uncertain
11. **Abstain Mode:** "Reviewed sources mein nahi mila"
12. **Source Trust Tiers:** official vs blog vs coaching
13. **Supersession Graph:** kaunsa order kisko badalta hai
14. **Watchtower alerts:** tracked topic mein change aaye to alert
15. **Export:** report PDF/shareable link
16. **Low-bandwidth / CSC Mode:** simple Hindi, kam data
17. **Campus Mode:** colleges ke notices ka gap check
18. **Officer Console (verified only):** neeche detail mein

## 8. Top 3 Core Features

### Core Feature 1: Gap + Conflict + Outdated Engine (Claim Graph)

Ye poore project ka dil hai. Har source ke claims ek graph mein jaate hain. Sabhi "Deadline" claims ek node group mein, sabhi "Documents" claims ek mein. Phir:

- Same attribute, alag value → **conflict**
- Expected attribute, koi claim nahi → **gap**
- Claim ki date/cycle purani → **outdated**

Iska fayda: user ko sirf "summary" nahi, balki **"yahan andhera hai"** ka map milta hai.

### Core Feature 2: Evidence Audit + Abstain Mode (Trust Layer)

Har finding ke saath exact quote, source link, aur location. Challenger aur Auditor agents milkar ensure karte hain ki bina evidence ke koi finding na dikhe. Jahan data nahi hai wahan system "nahi mila" bolta hai, andaza nahi lagata. Isse hallucination ka risk kam hota hai aur judges/users **source references inspect** kar sakte hain.

### Core Feature 3: Verify-Next Planner (Action Layer)

Sirf problems batana kaafi nahi, user ko batana hai **ab kya karna hai.** Planner findings ko priority ke saath checklist mein badalta hai, jaise:

1. (High) Current deadline official notice se confirm karo.
2. (High) Income document ka sahi type official PDF se confirm karo (do sources alag bol rahe hain).
3. (Medium) Renewal policy official portal par dhundho (reviewed sources mein nahi mili).
4. (Low) Helpline number verify karo.

## 9. Innovation (Isme naya kya hai)

- **"Kya missing hai" ko first-class problem banana:** baaki tools jawab dete hain, ye *sawaal ka andhera* dikhata hai.
- **Expected-Information Template:** topic type ke hisaab se "kya hona chahiye" ka blueprint, jisse missing cheez pakadna possible hota hai.
- **Hybrid reasoning:** numbers/dates deterministic code se, meaning-based comparison AI se.
- **Adversarial multi-agent check:** Challenger agent apne hi system ki findings todta hai.
- **Supersession Graph:** sirf date nahi, kaunsa order kisko replace karta hai.
- **Abstain-first design:** system apni limitation kholkar batata hai.
- **Two-sided platform:** citizen ko gap dikhta hai, officer ko yeh dikhta hai ki *log kahan confuse ho rahe hain.*
- **Authoritative Source Registry:** signed facts se third-party pages ka drift detect.

## 10. Uniqueness

| Ye tools karte hain | DarkSpot Atlas alag kyun hai |
| --- | --- |
| Search: links dete hain | Links ke andar ka gap dikhata hai |
| Chatbot: jawab dete hain | Jawab nahi, "kya verify karna baaki hai" batata hai |
| Summarizer: chhota karta hai | Missing cheezein highlight karta hai |
| Fact-checker: ek claim check karta hai | Poore topic ka attribute-wise audit |
| Govt portals: info rakhte hain | Cross-document consistency aur confusion root-cause nikalta hai |

**Unique combination:** Gap detection + Conflict detection + Staleness + Verify-Next checklist + Evidence audit + Officer-side Confusion Intelligence, sab ek hi platform par. (Note: "duniya mein pehla" ka claim nahi kar rahe, kyunki hamari search poori nahi thi. Hum kehte hain: *hamari research mein aisa integrated tool nahi mila.*)

## 11. Future Scope

1. **Mobile app (Android/iOS)** aur WhatsApp bot (gaon ke users ke liye).
2. **Voice input/output** Hindi aur regional languages mein (Bhashini jaise language infrastructure se).
3. **Browser extension:** koi bhi scholarship/scheme page kholte hi side-panel mein gaps dikhe.
4. **Multi-domain expansion:** health schemes, loans, jobs, university admissions, legal notices, business compliance.
5. **Policy Consistency Auditor:** publish se pehle draft circular check karna aur corrected single-source draft dena.
6. **Citizen Confusion Intelligence:** grievance/query text ko root cause (info gap / conflict / service failure) mein baantna, district aur scheme-step ke hisaab se, k-anonymity ke saath.
7. **Drift Watch:** officers ke digitally signed facts se blogs aur lookalike portals ki galat info pakadna.
8. **Integration:** CPGRAMS, NSP, DigiLocker jaisi systems ke saath officially.
9. **Fine-tuned Indian-context models:** Hindi/regional legal-administrative text par.
10. **CSC network:** common service centres ke operators ke liye assisted mode.
11. **Open API** developers aur NGOs ke liye.
12. **Federated/self-hosted deployment** departments ke liye data privacy ke saath.

**Adoption path:** pehle college/campus pilot, phir NGOs, phir government.

## 12. Revenue Models

| Model | Kaun pay karega | Kaise |
| --- | --- | --- |
| **Freemium (citizen)** | Students/aam log | Basic analysis free; zyada sources, saved reports, Watchtower alerts premium (chhota monthly plan). |
| **Campus SaaS** | Colleges/universities | Admission, exam, scholarship notices ka gap check + student confusion dashboard; per-student ya yearly licence. |
| **Government / Department licence** | Departments, state portals | Policy Consistency Auditor + Confusion Intelligence; annual contract / tender. |
| **CSC / Assisted-access partnership** | CSC operators | Per-assisted-query commission ya revenue share. |
| **API access** | EdTech, NGOs, fintech, legal-tech | Pay-per-use gap-check API. |
| **Coaching/EdTech compliance** | Coaching institutes | Apni content ki accuracy check karne ka tool (sirf accuracy; sponsored ranking nahi). |
| **CSR / Grants** | Foundations, digital-inclusion programmes | Rural/low-bandwidth deployment ke liye funding. |

**Trust rule:** koi bhi paid partner findings ya source ranking ko influence nahi kar sakta. Ye hamari credibility ki baat hai.

## 13. Workflow (Solution kaise kaam karta hai)

**Citizen flow**

1. User question likhta hai: *"Scholarship apply karne se pehle kya verify karun?"*
2. System topic type samajhta hai (scholarship) aur "expected info" checklist banata hai.
3. User sources add karta hai (official page, blog, PDF) ya system permitted search se laata hai.
4. Har source ka text padha jaata hai, date aur trust tier tag hota hai.
5. Claims nikalte hain (deadline, eligibility, documents, renewal...).
6. Claims compare hote hain: code se numbers/dates, AI se text.
7. Dashboard dikhta hai: *Key info* · *Gaps* · *Conflicts* · *Outdated* · *Unanswered*.
8. User kisi bhi finding par click karke **source snippet** dekhta hai.
9. System **Verify-Next checklist** deta hai (priority + official link).
10. User tracking on kar sakta hai; source change hone par Watchtower alert aata hai.

**Sample output**

> **Potential gap:** renewal requirements reviewed sources mein nahi mile. **Possible conflict:** Source A aur Source B alag income document batate hain. \[dono evidence dekho\] **Possibly outdated:** Source C 2023-24 cycle ka lagta hai. **Verify next:** latest official scholarship notice se deadline, document list aur apply link confirm karo.

**Officer flow (verified only)**

1. Officer secure login karta hai (official email/DSC + passkey).
2. Apni scheme ke documents upload karta hai, system contradictions aur superseded rules dikhata hai.
3. Key facts (deadline, eligibility, link) digitally sign karta hai (dual approval).
4. System third-party pages se match karke "yahan purani deadline hai" alert deta hai.
5. Confusion dashboard (anonymised) dikhata hai ki kis step par log atak rahe hain.

## 14. Website, App aur Admin Dashboard

### A. Website mein kya rahega

- **Home:** question box, example topics (scholarship, scheme, admission)
- **Analysis page:** sources add/upload, live progress (agents kya kar rahe hain)
- **Results dashboard:** Key Info, Gap Heatmap, Conflicts, Outdated, Unanswered, Trust labels
- **Evidence Viewer:** source snippet side-panel
- **Verify-Next Checklist:** tick karne layak, export ke saath
- **Saved reports + Watchtower alerts** (login ke baad)
- **Campus Mode** page
- **Officer Console** (verified login, alag section)
- **Language toggle** (Hindi/English), lite mode
- **"How it works" + limitations page** (transparency)

### B. App mein kya rahega

- Same core analysis, mobile-friendly UI
- **Voice input** (bol kar sawaal)
- **Share report** WhatsApp par
- **Push notifications** deadline change/Watchtower par
- **Offline-friendly lite mode** (saved reports offline)
- **Camera/PDF scan:** notice ki photo khinch kar gap check
- **Simple Hindi mode** aur large-text mode

### C. Admin Dashboard

**Haan, banega.** Do level par:

**1. Platform Admin (humari team)**

- Users aur officers ki verification approval
- Source trust-tier list manage karna
- Agent performance, accuracy aur error logs
- Abuse/misuse reports, flagged findings review
- System health, API usage, cost monitoring
- Immutable audit log

**2. Officer / Institution Admin Dashboard**

- Department-wise role aur access control
- Signed facts registry (dual approval)
- Policy Consistency Auditor results
- Citizen Confusion heatmap (scheme, step, district) with **k-anonymity** (chhote groups hide)
- Drift Watch alerts aur correction-request workflow
- DPDP compliance settings: data retention, consent, anonymisation

**Security:** hardware-key/passkey login, role-based access, audit trail, signed facts par dual approval, aur sirf aggregated/anonymised data dikhana.

## 15. Demo Plan (Hackathon ke liye honest scope)

- **Fit with problem statement:** input → source review → gaps/conflicts/outdated → checklist, sab covered.
- **Judging focus:** ek polished core, kai adhoore features se behtar. Isliye demo mein: Core workspace + Evidence Audit + Module 1 ka thin demo; baaki roadmap mein.
- **Demo data:** real public documents (official scholarship page, citizen charter PDF) ya clearly-labelled sample sources. Synthetic data ko "Sample" label karo.
- **Risk honesty:** officer verification demo mein admin-invite + passkey se dikhegi; production mein department identity chahiye. Government adoption slow hota hai, isliye pehle college pilot.
