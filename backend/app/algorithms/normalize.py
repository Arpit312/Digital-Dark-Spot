import re
from typing import Dict, Any, List, Optional
from datetime import datetime

MONTHS_MAP = {
    "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
    "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
    "aug": 8, "august": 8, "sep": 9, "sept": 9, "september": 9, "oct": 10,
    "october": 10, "nov": 11, "november": 11, "dec": 12, "december": 12
}

def normalize_date(raw_date_str: str, default_year: Optional[int] = None) -> Dict[str, Any]:
    """
    Normalizes date to ISO-8601 (YYYY-MM-DD).
    Handles formats like '15/11/2025', '15 Nov 2025', 'November 15', '15-11-25', etc.
    If year is missing, uses default_year and flags inferred=True.
    """
    if not raw_date_str:
        return {"iso": None, "inferred": False, "raw": raw_date_str}
        
    cleaned = raw_date_str.strip()
    
    # Try dateparser if available
    try:
        import dateparser
        parsed = dateparser.parse(
            cleaned,
            languages=['en', 'hi'],
            settings={'PREFER_DAY_OF_MONTH': 'first', 'DATE_ORDER': 'DMY'}
        )
        if parsed:
            has_year = bool(re.search(r'\b(20\d\d|\d{2})\b', cleaned))
            inferred = False
            if not has_year and default_year:
                parsed = parsed.replace(year=default_year)
                inferred = True
            return {
                "iso": parsed.strftime("%Y-%m-%d"),
                "inferred": inferred,
                "raw": raw_date_str
            }
    except Exception:
        pass

    # Built-in fallback parser
    # Pattern 1: DD/MM/YYYY or DD-MM-YYYY
    m1 = re.search(r'(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})', cleaned)
    if m1:
        day, month, year = int(m1.group(1)), int(m1.group(2)), int(m1.group(3))
        if year < 100:
            year += 2000
        try:
            dt = datetime(year, month, day)
            return {"iso": dt.strftime("%Y-%m-%d"), "inferred": False, "raw": raw_date_str}
        except ValueError:
            pass

    # Pattern 2: DD Month YYYY or Month DD YYYY
    m2 = re.search(r'(\d{1,2})(?:st|nd|rd|th)?\s+([a-zA-Z]+)(?:\s+(\d{4}))?', cleaned)
    if m2:
        day = int(m2.group(1))
        month_name = m2.group(2).lower()
        year_str = m2.group(3)
        month = MONTHS_MAP.get(month_name)
        if month:
            inferred = False
            if year_str:
                year = int(year_str)
            elif default_year:
                year = default_year
                inferred = True
            else:
                year = datetime.now().year
                inferred = True
            try:
                dt = datetime(year, month, day)
                return {"iso": dt.strftime("%Y-%m-%d"), "inferred": inferred, "raw": raw_date_str}
            except ValueError:
                pass

    return {"iso": None, "inferred": False, "raw": raw_date_str}

def normalize_amount(raw_amount_str: str) -> Dict[str, Any]:
    """
    Normalizes currency amounts (₹, INR, Rs., Lakh, Crore, etc.) to standard integer.
    Example: '₹1.5 lakh' -> 150000, '2.5 Crore' -> 25000000, 'Rs 50,000' -> 50000
    """
    if not raw_amount_str:
        return {"value": None, "raw": raw_amount_str}
        
    text = raw_amount_str.lower().replace(",", "").strip()
    
    # Check crore
    crore_match = re.search(r'([\d\.]+)\s*(?:crore|cr)', text)
    if crore_match:
        val = int(float(crore_match.group(1)) * 10000000)
        return {"value": val, "raw": raw_amount_str}
        
    # Check lakh
    lakh_match = re.search(r'([\d\.]+)\s*(?:lakh|lac)', text)
    if lakh_match:
        val = int(float(lakh_match.group(1)) * 100000)
        return {"value": val, "raw": raw_amount_str}
        
    # Check standard numbers with currency symbols
    num_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d+)', text)
    if num_match:
        return {"value": int(num_match.group(1)), "raw": raw_amount_str}
        
    return {"value": None, "raw": raw_amount_str}

def normalize_percentage(raw_pct_str: str) -> Dict[str, Any]:
    """
    Normalizes percentages like '60%', '60 percent', '60.5 %' -> float 60.5
    """
    if not raw_pct_str:
        return {"value": None, "raw": raw_pct_str}
        
    match = re.search(r'([\d\.]+)\s*(?:%|percent)', raw_pct_str.lower())
    if match:
        return {"value": float(match.group(1)), "raw": raw_pct_str}
    return {"value": None, "raw": raw_pct_str}

def normalize_document_set(doc_list: List[str]) -> List[str]:
    """
    Normalizes document list: lowercases, strips, cleans punctuation, canonical aliases.
    Example: 'Income Certificate' -> 'income certificate', 'Aadhaar Card' -> 'aadhaar'
    """
    canonical_map = {
        "aadhaar card": "aadhaar",
        "adhaar": "aadhaar",
        "income certificate": "income certificate",
        "income affidavit": "income affidavit",
        "caste certificate": "caste certificate",
        "domicile certificate": "domicile",
        "residence certificate": "domicile",
        "bank passbook": "bank passbook",
        "marksheet": "marksheet",
        "mark sheet": "marksheet"
    }
    
    normalized = set()
    for item in doc_list:
        clean_item = re.sub(r'[^\w\s]', '', item.lower()).strip()
        mapped = canonical_map.get(clean_item, clean_item)
        if mapped:
            normalized.add(mapped)
            
    return sorted(list(normalized))
