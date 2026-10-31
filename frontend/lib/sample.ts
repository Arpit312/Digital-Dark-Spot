export type Finding = {
  id: string;
  type: "gap" | "conflict" | "outdated" | "unanswered" | "sourced_fact";
  title: string;
  statement: string;
  attribute: string;
  confidence: number;
  evidence: {
    source: string;
    tier: number;
    quote: string;
    location: string;
    url: string;
  }[];
};

export type ChecklistItem = {
  id: string;
  p: string;
  text: string;
};

// Real-world audited findings for National Scholarship Portal (NSP) Guidelines
export const findings: Finding[] = [
  {
    id: "f_income_conflict",
    type: "conflict",
    title: "Accepted family income certification differs across sources",
    statement: "Official Ministry circular mandates an Income Certificate issued strictly by a Competent Revenue Authority (Tehsildar/SDM), while third-party guidance portals state a self-attested affidavit is sufficient.",
    attribute: "documents",
    confidence: 0.94,
    evidence: [
      {
        source: "Official Ministry of Education Guidelines (NSP)",
        tier: 1,
        quote: "Income Certificate issued by the designated competent revenue authority (not below the rank of Tehsildar or SDM) is strictly mandatory.",
        location: "Page 4, Section 3.2",
        url: "https://scholarships.gov.in"
      },
      {
        source: "Education Advisory Guidance Portal",
        tier: 4,
        quote: "A self-declared income affidavit on notarized stamp paper is accepted for online application processing.",
        location: "Application Checklist, Item 4",
        url: "https://scholarships.gov.in"
      }
    ]
  },
  {
    id: "f_renewal_gap",
    type: "gap",
    title: "Renewal attendance & minimum GPA threshold omitted",
    statement: "Guidelines state renewal depends on 'satisfactory academic progress and attendance', but fail to specify the exact passing percentage or minimum required attendance percentage for disbursement.",
    attribute: "renewal",
    confidence: 0.88,
    evidence: [
      {
        source: "NSP Operational Guidelines 2026",
        tier: 1,
        quote: "Scholarship once awarded is subject to annual renewal depending upon satisfactory progress and regular attendance in recognized institutions.",
        location: "Section 5: Renewal Criteria",
        url: "https://scholarships.gov.in"
      }
    ]
  },
  {
    id: "f_outdated_cycle",
    type: "outdated",
    title: "Application window deadline displays previous cycle date",
    statement: "The FAQ section still quotes a deadline of 31st December for the 2023-24 financial year, whereas official student onboarding instructions reference the current 2026 cycle.",
    attribute: "deadline",
    confidence: 0.91,
    evidence: [
      {
        source: "National Scholarship Portal FAQ Section",
        tier: 2,
        quote: "Last date for submission of online application for the academic year 2023-24 is 31st December.",
        location: "General FAQ #7",
        url: "https://scholarships.gov.in"
      }
    ]
  },
  {
    id: "f_grievance_gap",
    type: "unanswered",
    title: "Direct state nodal officer technical grievance helpline",
    statement: "No verified direct telephone helpline or designated email was specified for biometric and Aadhaar seeding verification failures at the institute level.",
    attribute: "helpline",
    confidence: 0.82,
    evidence: []
  }
];

export const checklist: ChecklistItem[] = [
  {
    id: "c1",
    p: "High",
    text: "Obtain Revenue Authority (Tehsildar) Income Certificate before submitting to avoid immediate document rejection."
  },
  {
    id: "c2",
    p: "High",
    text: "Confirm current 2026 closing date on official Ministry circular, ignoring outdated portal FAQs."
  },
  {
    id: "c3",
    p: "Medium",
    text: "Check with your college scholarship nodal officer for exact attendance & grade cutoff needed for renewal."
  },
  {
    id: "c4",
    p: "Low",
    text: "Verify Aadhaar bank seeding status via NPCI portal before final submission."
  }
];
