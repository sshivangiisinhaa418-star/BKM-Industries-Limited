         # BKM Industries - Attack Surface Inventory

## 1. Scope

- **Target System:** BKM Industries Limited - Local Static Web Application
- **Assessment Type:** Authorized Attack Surface Discovery & Reconnaissance Inventory (Non-intrusive / Defensive)
- **Filesystem Root:** `c:\Users\fx_qu\Downloads\BKM Website\BKM-Industries-Limited`
- **Application Nature:** Static multi-page website (HTML5, Vanilla CSS3, Vanilla ES6 JavaScript, Media, and PDF Repositories) served locally via Node `serve`.
- **Operating Constraints:** Passive discovery only; no files modified, deleted, or exploited.

---

## 2. Application Structure

```text
BKM-Industries-Limited/
├── .git/                                   [Version Control Repository]
├── package.json                            [Local Dev Runner Config]
├── README.md                               [Project Overview]
├── index.html                              [Home / Landing Page]
├── about.html                              [Corporate Profile]
├── founders-journey.html                   [History & Journey]
├── leadership.html                         [Executive & Board Biographies]
├── awards-recognition.html                 [Company Accolades & Filter UI]
├── businesses-overview.html                [Business Portfolio Index]
├── tin-cans.html                           [Product Line: Tin Containers]
├── ropp-closures.html                      [Product Line: ROPP Caps]
├── crown-caps.html                         [Product Line: Crown Caps]
├── esg.html                                [ESG & Sustainability Disclosures]
├── careers.html                            [Recruitment & People Operations]
├── announcements.html                      [Stock Exchange Archive & Ticker UI]
├── error.html                              [Custom 404 / Error Template]
├── terms.html                              [Legal & Privacy Terms]
├── investors.html                          [Investor Relations Hub]
├── investor-results-reports.html           [Financial Reports & Table Filter]
├── investor-presentation.html              [Corporate Presentations]
├── investor-corporate-governance.html      [Policies & Committee Charters]
├── investor-sec-filings.html               [Statutory & SEC Disclosures]
├── investor-stock-exchange-announcements.html [Exchange Announcements Mirror]
├── investor-sebi-disclosures.html          [SEBI Filings & Disclosures]
├── investor-corporate-calendar.html        [Board Meetings & Trading Schedule]
├── investor-shareholder-info.html          [Registrar, Demat & Grievance Contacts]
├── investor-contact.html                   [Compliance & IR Contact Directory]
├── script.js                               [Core Interactive Logic & Global APIs]
├── style.css                               [Unified Styling & Design System]
└── assets/
    ├── [Media Files: 21 PNG, 7 JPG, 1 SVG]
    └── pdf/
        ├── Announcements/                  [Subfolders 2017 to 2026: ~340 PDFs]
        ├── financial/                      [Quarterly & Annual Filings: ~20 PDFs]
        └── policies/                       [Governance & Statutory Policies: 23 PDFs]
```

---

## 3. HTML Inventory

A total of **24 HTML files** were inventoried across the web root.

| Relative Path | Page Title | Forms | Links | Scripts | Ext Res | Query Params Referenced | Inline Handlers | Status / Accessibility |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| `about.html` | About Us \| BKM Industries Limited - Driving Industrial Impact | 0 | 54 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `announcements.html` | Stock Exchange Announcements & Disclosures \| BKM Industries Limited | 0 | 62 | 2 | 4 | `family`, `display` | None | Publicly accessible |
| `awards-recognition.html` | Awards & Recognitions \| BKM Industries Limited | 0 | 55 | 2 | 4 | `family`, `display` | `onclick="filterAwards(...)"` | Publicly accessible |
| `businesses-overview.html` | Businesses Overview \| BKM Industries Limited | 0 | 58 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `careers.html` | Careers \| BKM Industries Limited - Work Culture & People Leadership | 0 | 62 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `crown-caps.html` | Metal Crown Caps \| Our Businesses \| BKM Industries Limited | 0 | 56 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `error.html` | Page Unavailable \| BKM Industries Limited | 0 | 51 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `esg.html` | ESG & Sustainability \| BKM Industries Limited | 0 | 61 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `founders-journey.html` | Founder's Journey & History \| BKM Industries Limited | 0 | 59 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `index.html` | BKM Industries Limited \| Driving Industrial Impact & Marine Engineering | 1 | 82 | 3 | 7 | `family`, `display` | `onsubmit="alert(...)"` | Publicly accessible (⚠️ Includes external hook script) |
| `investor-contact.html` | Investor Contact Us \| BKM Industries Limited | 0 | 66 | 2 | 5 | `family`, `display` | None | Publicly accessible |
| `investor-corporate-calendar.html` | Corporate Calendar \| Investor Relations \| BKM Industries Limited | 0 | 61 | 2 | 4 | `family`, `display` | None | Publicly accessible |
| `investor-corporate-governance.html` | Corporate Governance \| Investor Relations \| BKM Industries Limited | 0 | 107 | 2 | 4 | `family`, `display` | `onmouseover`, `onmouseout` | Publicly accessible |
| `investor-presentation.html` | Investor Presentation \| BKM Industries Limited | 0 | 61 | 2 | 4 | `family`, `display` | None | Publicly accessible |
| `investor-results-reports.html` | Results and Reports \| Investor Relations \| BKM Industries Limited | 0 | 133 | 2 | 4 | `family`, `display` | `onchange="filterTable()"`, `onclick="previewPDF(...)"`, `onclick="setQ(...)"`, `onclick="closePDFModal()"` | Publicly accessible |
| `investor-sebi-disclosures.html` | SEBI Disclosures \| Redirecting... | 0 | 66 | 3 | 4 | `family`, `display` | None | Publicly accessible (Contains auto-redirect logic) |
| `investor-sec-filings.html` | SEC Filings \| Investor Relations \| BKM Industries Limited | 0 | 61 | 2 | 4 | `family`, `display` | None | Publicly accessible |
| `investor-shareholder-info.html` | Shareholder Information \| BKM Industries Limited | 0 | 61 | 2 | 4 | `family`, `display` | None | Publicly accessible |
| `investor-stock-exchange-announcements.html` | Stock Exchange Announcements & Disclosures \| BKM Industries Limited | 0 | 62 | 2 | 4 | `family`, `display` | None | Publicly accessible |
| `investors.html` | Investor Relations \| BKM Industries Limited | 0 | 70 | 2 | 5 | `family`, `display` | `onclick="closePDFModal()"` | Publicly accessible |
| `leadership.html` | Leadership & Board of Directors \| BKM Industries Limited | 0 | 56 | 2 | 4 | `family`, `display` | `onclick="switchLeadershipTab(...)"`, `onclick="openBioModal(...)"`, `onclick="closeBioModal()"` | Publicly accessible |
| `ropp-closures.html` | ROPP Caps \| Our Businesses \| BKM Industries Limited | 0 | 56 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `terms.html` | Terms & Conditions \| BKM Industries Limited | 0 | 54 | 1 | 4 | `family`, `display` | None | Publicly accessible |
| `tin-cans.html` | Tin Cans \| Our Businesses \| BKM Industries Limited | 0 | 56 | 1 | 4 | `family`, `display` | None | Publicly accessible |

---

## 4. JavaScript Inventory

### 4.1 Application Script Files

- **File Path:** `script.js`
- **File Size:** 27,256 Bytes (~27.3 KB, 674 Lines)
- **Functional Modules Detected:**
  1. Header Scroll Shadow & Sticky Navbar Transition
  2. Mobile Navigation Hamburger Menu Toggle
  3. Interactive Business Operations Interactive Tabs (`switchTab`)
  4. Animated Statistical Metrics Counter (`IntersectionObserver`)
  5. FAQ Accordion Collapsible Cards
  6. Smooth Scroll Navigation Anchor Routing
  7. Scroll Reveal Animation Engine (`IntersectionObserver`)
  8. Interactive GIS Leaflet Map Engine & Custom Markers (Kolkata HQ, Silvassa Plant, Mumbai Sales Office)
  9. Scroll-to-Top Floating Button Trigger
  10. Live RSS Feed Reader via Third-party JSON Proxy (`https://api.rss2json.com`)
  11. Dynamic Navigation Badge & Mini SVG Map Renderer
  12. Localization & Google Translate Dynamic Loader (`translate.google.com`)
  13. Client-side Cookie Manipulation for Language Persistence (`googtrans`)
  14. PDF Viewer Modal Management (`previewPDF`, `closePDFModal`, ESC Key Bindings)
  15. Google Analytics 4 (GA4) Custom Event Dispatcher

### 4.2 Security-Sensitive API Inventory in `script.js`

| API / Method | Total Occurrences | Line Numbers | Context & Potential Risk Pattern |
| :--- | :---: | :--- | :--- |
| `innerHTML` | 5 | Lines: 376, 429, 487, 489, 513 | Used to clear announcement tracks (376), inject SVG mini map markup (429), wrap "ISO" tags (489), and build language selector dropdown (513). |
| `fetch()` | 1 | Line: 366 | Requests third-party RSS-to-JSON proxy `https://api.rss2json.com/v1/api.json?rss_url=...` without client-side input validation on returned data. |
| `location.href` | 9 | Lines: 457, 610, 620, 631, 636, 647, 652, 665, 669 | Anchor redirect handling (457) and GA4 page location attribute extraction. |
| `document.createElement('script')` | 1 | Line: 577 | Dynamically injects script `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit` into `document.head`. |
| `document.cookie` | 6 | Lines: 502, 537, 538, 540, 541, 542 | Direct client-side cookie write for `googtrans` without `SameSite` or `Secure` flags. |
| `iframe.src` (in HTML scripts) | 2 | `investor-results-reports.html:1033`, `investors.html:1057` | Injects local PDF paths dynamically into `<iframe>` inside modal without origin strictness. |

---

## 5. CSS Inventory

- **File Path:** `style.css`
- **File Size:** 151,105 Bytes (~151.1 KB, 5,210 Lines)
- **Framework/Library:** Custom Vanilla CSS Design System with CSS Custom Properties (`--primary-color`, `--secondary-color`, `--accent-color`, etc.).
- **External Imports:** Google Fonts (`Inter`, `Outfit`) referenced via `<link>` tags in HTML.
- **Key Layout Blocks:** Responsive CSS Grid, Flexbox Containers, Glassmorphic Modals, Interactive Accordions, Table Data Cards, Print Media Rules, Responsive Media Queries (`@media (max-width: 992px)`, `@media (max-width: 768px)`).
- **Duplicate / Legacy CSS:** None detected.

---

## 6. Image & Media Inventory

### 6.1 Distribution by Format

| Media Type | Extension | Count | Locations |
| :--- | :---: | :---: | :--- |
| Portable Network Graphics | `.png` | 21 | `assets/` |
| Joint Photographic Experts Group | `.jpg` / `.jpeg` | 7 | `assets/` |
| Scalable Vector Graphics | `.svg` | 1 | `assets/india_map.svg` |
| WebP / GIF / ICO / Video | `.webp`, `.gif`, `.ico`, `.mp4`, `.webm` | 0 | N/A |
| **Total Media Files** | | **29** | |

### 6.2 SVG Security Analysis

- **File:** `assets/india_map.svg` (176.2 KB)
- **Script Analysis:** Inspected for embedded `<script>` tags, XML external entities (XXE), `xlink:href`, and inline event handlers (`onload`, `onerror`).
- **Result:** Clean. Contains pure path data and geometry definitions; no executable code found.

---

## 7. PDF & Document Inventory

### 7.1 Overview & Metrics

- **Total PDF Files:** **383 documents**
- **Other Office Documents (.doc, .xls, .csv, .zip):** 0
- **Total Combined Size:** ~425 MB

### 7.2 Directory Distribution

1. **`assets/pdf/Announcements/` (~340 files):**
   - Contains yearly subfolders: `2017/`, `2018/`, `2019/`, `2020/`, `2021/`, `2022/`, `2023/`, `2024/`, `2025/`, `2026/`.
   - **Filename Predictability Pattern:** Highly predictable automated naming standard:
     `BKMINDST_[DDMMYYYYHHMMSS]_[ReportType].pdf` (e.g., `BKMINDST_14082026181154_SDD.pdf`).
2. **`assets/pdf/financial/` (~20 files):**
   - Subfolders: `2023-24/`, `2024-25/`, `2025-26/`, `2026-27/`, `annual/`.
   - Contains balance sheets, audit reports, limited review filings, and signed annual statements.
3. **`assets/pdf/policies/` (23 files):**
   - Contains corporate governance charters (Code of Conduct, Whistleblower, Anti-Bribery, Insider Trading, Cyber Security, etc.).

### 7.3 Reference Validation

- **Referenced in Code / UI:** 382 files are cataloged in `announcements.html`, `investor-results-reports.html`, `investor-corporate-governance.html`, or `index.html`.
- **Unreferenced / Orphaned PDF:**
  - `assets/pdf/policies/Conflict_of_Interest_Policy.pdf` (File exists on disk but is not linked in any HTML page).

---

## 8. External Resources

| Domain | Protocol | Resource Type | Found In | Ref Count | Security Context |
| :--- | :---: | :--- | :--- | :---: | :--- |
| `192.168.85.128:3000` | **HTTP** | Injected Remote Script (`hook.js`) | `index.html:L6` | 1 | 🚨 **Potential Finding (High Severity):** Plain-text HTTP script hook pointing to a private LAN address (Signature of Browser Exploitation Framework - BeEF). |
| `fonts.googleapis.com` | HTTPS | Web Font Stylesheet | All 24 HTML files | 25 | Third-party Font CDN |
| `fonts.gstatic.com` | HTTPS | Web Font Binary Preconnect | All 24 HTML files | 24 | Google Font Hosting |
| `cdnjs.cloudflare.com` | HTTPS | FontAwesome Icon Stylesheet | All 24 HTML files | 24 | Third-party Library CDN (v6.4.0) |
| `unpkg.com` | HTTPS | Leaflet CSS & JS (`v1.9.4`) | `index.html:L27-30` | 2 | Third-party Map Library CDN (Loaded with SRI hashes) |
| `server.arcgisonline.com` | HTTPS | Map Tile Server (ESRI ArcGIS) | `script.js:L281` | 1 | Tile Imagery Provider |
| `www.esri.com` | HTTPS | Attribution Link | `script.js:L282` | 1 | Informational Link |
| `www.moneycontrol.com` | HTTPS | RSS Feed Endpoint | `script.js:L360` | 1 | Financial News Feed |
| `api.rss2json.com` | HTTPS | Third-party API Proxy | `script.js:L363` | 1 | XML-to-JSON API Service |
| `translate.google.com` | HTTPS / Protocol-relative | Script Injection | `script.js:L579` | 1 | Translation Service Loader |
| `www.googletagmanager.com` | HTTPS | Analytics Loader | `script.js:L624` | 1 | Google Analytics 4 |
| `www.mca.gov.in` | **HTTP** | Outbound Informational Link | `investor-contact.html`, `investors.html` | 2 | ⚠️ Mixed Content / Insecure Link |

---

## 9. API / Network Endpoints

| Endpoint URL | HTTP Method | Origin | Calling Function / Location | Auth Required | Classification |
| :--- | :---: | :---: | :--- | :---: | :--- |
| `http://192.168.85.128:3000/hook.js` | GET | External / LAN | `<script src="...">` at `index.html:L6` | None | Injected Script Hook |
| `https://api.rss2json.com/v1/api.json` | GET | External | `fetchAnnouncements()` at `script.js:L366` | No (Public) | External JSON Proxy API |
| `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}` | GET | External | `L.tileLayer()` at `script.js:L281` | No (Public) | Geospatial Tile Server |
| `//translate.google.com/translate_a/element.js` | GET | External | `loadGoogleTranslateScript()` at `script.js:L579` | No (Public) | Google Translation API |

---

## 10. Directory Inventory

```text
.
├── .git/                                   [Potentially sensitive: Git Version Control folder]
│   ├── hooks/
│   ├── info/
│   ├── logs/
│   ├── objects/
│   └── refs/
├── assets/                                 [Public Static Asset Directory]
│   ├── pdf/                                [Public Regulatory Document Archive]
│   │   ├── Announcements/                  [Yearly Corporate Disclosures 2017 - 2026]
│   │   ├── financial/                      [Quarterly & Annual Financial Disclosures]
│   │   └── policies/                       [Company Governance Policies]
└── [Root HTML / JS / CSS Source Code]
```

---

## 11. Security-Relevant Files

| File / Path | Sensitivity Level | Description & Security Relevance |
| :--- | :---: | :--- |
| `.git/` | **High** | Git metadata directory. If deployed to production without `.gitignore` or server restrictions, entire source code history and internal developer commits can be dumped via `.git/` disclosure. |
| `package.json` | **Low** | Identifies build/dev tooling (`npx serve .`). |
| `index.html` | **High** | Line 6 contains active script reference to `http://192.168.85.128:3000/hook.js`. |
| `error.html` | **Low** | Custom client-side error page. Does not leak stack traces or server version headers. |

---

## 12. Dependency Inventory

| Dependency / Library | Version | Delivery Source | Integrity Check (SRI) Present |
| :--- | :---: | :--- | :---: |
| **FontAwesome** | 6.4.0 | CDN (`cdnjs.cloudflare.com`) | ❌ No |
| **Leaflet CSS** | 1.9.4 | CDN (`unpkg.com`) | ✅ Yes (`sha256-p4NxAoJ...`) |
| **Leaflet JS** | 1.9.4 | CDN (`unpkg.com`) | ✅ Yes (`sha256-20nQCch...`) |
| **Google Fonts** (Inter & Outfit) | Latest | CDN (`fonts.googleapis.com`) | N/A (CSS font-face) |
| **Google Translate Element** | Dynamic | CDN (`translate.google.com`) | ❌ No |
| **serve (Node.js)** | Latest (via npx) | Local Development Server | Local CLI |

---

## 13. Orphaned / Unreferenced Resources

1. **Unreferenced Policy PDF:**
   - `assets/pdf/policies/Conflict_of_Interest_Policy.pdf` — Exists in document storage but is missing from [investor-corporate-governance.html](file:///c:/Users/fx_qu/Downloads/BKM%20Website/BKM-Industries-Limited/investor-corporate-governance.html).
2. **Unreferenced Asset Images:**
   - `assets/a.png`
   - `assets/logo1.png`
   - `assets/ropp1.png`
   - `assets/founder_hero1.png`
   *(These are legacy/alternative versions stored in `assets/` not directly linked in current HTML).*

---

## 14. Potential Areas for Manual Security Testing

1. **Third-Party Script Ingestion (`hook.js`):**
   - Verify origin and purpose of `http://192.168.85.128:3000/hook.js` in `index.html`. In a production release, loading scripts over plain HTTP or from untrusted IP spaces allows Man-in-the-Middle (MitM) script injection and full client session takeover.
2. **Predictable Document Paths & Information Enumeration:**
   - `assets/pdf/Announcements/` follows deterministic naming (`BKMINDST_YYYYMMDD...`). Assess whether unpublished or embargoed financial filings could be indexed or discovered prematurely via directory traversal or brute-force pattern enumeration.
3. **Missing Subresource Integrity (SRI) on CDNs:**
   - FontAwesome CDN on `cdnjs.cloudflare.com` is loaded without `integrity="..."` attributes across all 24 HTML files.
4. **DOM Manipulation via External Data (`fetchAnnouncements`):**
   - `script.js` retrieves data from `api.rss2json.com` and creates DOM elements dynamically. Test whether malicious RSS feed title/link payloads could lead to DOM-based Cross-Site Scripting (DOM XSS).
5. **Client-Side Cookie Security for Language Switching:**
   - `googtrans` cookies are generated via JavaScript without `SameSite=Lax/Strict` or `Secure` flags.
6. **PDF Iframe Viewer Isolation:**
   - PDF modal iframe (`#pdfIframe`) lacks `sandbox` attributes, allowing PDF viewer plugins to execute within the parent browsing context.
7. **Direct `.git` Directory Exposure:**
   - When migrating from local dev server (`npx serve`) to production web servers (Nginx, Apache, IIS, Cloudflare Pages, AWS S3), ensure `.git` and hidden configuration files are strictly blocked from public HTTP access.
8. **Insecure External Links (`http://`):**
   - Outbound link `http://www.mca.gov.in` in `investor-contact.html` is plain HTTP. Upgrade to HTTPS to prevent mixed content warnings and downgrade attacks.
9. **Automated Redirect Behavior in `investor-sebi-disclosures.html`:**
   - Analyze redirect logic to ensure destination parameters cannot be controlled via open redirect attack vectors.
10. **Form Submission Handling:**
    - Contact form in `index.html` relies on client-side JS alert; verify how input data will be handled once connected to a backend processing API.

---

## 15. Summary Statistics

| Asset Type | Count |
| :--- | :---: |
| **HTML pages** | 24 |
| **JavaScript files** | 1 (`script.js`) |
| **CSS files** | 1 (`style.css`) |
| **Images / media files** | 29 (21 PNG, 7 JPG, 1 SVG) |
| **PDF files** | 383 |
| **Other documents** | 0 |
| **External domains referenced** | 11 |
| **API / Network endpoints** | 4 |
| **Total Directories** | 19 |
| **Security-relevant files** | 3 (`.git`, `package.json`, `index.html:hook.js`) |
