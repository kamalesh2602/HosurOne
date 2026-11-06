# HosurOne Data Directory (`data/`)

This directory contains the canonical JSON datasets powering the **HosurOne** regional portal. All records in this directory are public domain civic information, verified against official disclosures, municipal records, and community ground-truth inspection.

---

## 1. Directory Overview & Files

| Dataset File | Entity Type | Current Verified Count | Primary Focus |
|---|---|---|---|
| [`government.json`](government.json) | Government & Civic Offices | 7 records | Hosur City Municipal Corp HQ, Taluk offices (Hosur, Denkanikottai, Shoolagiri), Police stations, RTO, TANGEDCO/TNEB |
| [`banks.json`](banks.json) | Commercial Bank Branches | 5 records | Commercial branches with verified RBI IFSC codes, MICR, addresses across Hosur Main and SIPCOT |
| [`hospitals.json`](hospitals.json) | Healthcare Facilities | 5 records | Hosur District HQ Hospital, ESI Hospital, rural 24/7 Primary Health Centres (Kelamangalam, Bagalur, Denkanikottai) |
| [`atms.json`](atms.json) | 24/7 Bank ATMs & CDMs | 4 records | Automated teller machines, cash deposit recyclers, street addresses in Hosur Main and SIPCOT |
| [`places.json`](places.json) | Places, Parks & Heritage | 6 records | Cultural hill temples, municipal lake promenades, irrigation reservoirs, memorials, and valley viewpoints |
| [`contacts.json`](contacts.json) | Helplines & Emergency | 6 records | 24/7 toll-free emergency dispatch (112, 108, 101, 181, 1098), municipal grievance control room, TNEB complaints |

---

## 2. Dataset Schemas & Conventions

Every file contains a valid JSON array of objects.

### Identification & Naming Convention
- Every record has an `id` prefixed by its domain:
  - `gov-` for government offices (e.g. `gov-hosur-corp-hq`)
  - `bank-` for bank branches (e.g. `bank-sbi-hosur-main`)
  - `hosp-` for healthcare facilities (e.g. `hosp-hosur-gh`)
  - `atm-` for ATM locations (e.g. `atm-sbi-old-busstand`)
  - `place-` for landmarks and parks (e.g. `place-ramanaicken-lake`)
  - `cont-` for emergency and civic contacts (e.g. `cont-medical-108`)

### Dual Schema Compatibility
To guarantee complete interoperability across all frontend views and backend query interfaces:
- Coordinate values are provided both flat (`latitude: 12.7383`, `longitude: 77.8286`) and nested (`coordinates: { latitude: 12.7383, longitude: 77.8286 }`).
- Contact numbers are provided under both `phone` and `contact`.
- Official source URLs are provided under both `sourceUrl` and `officialSource`.
- Bank records provide both unified `name` and specific `bankName` / `branchName`.
- Government records provide both `department` and `description`.

---

## 3. How to Add a New Record

1. Open the appropriate `.json` file in this directory.
2. Locate the closing bracket `]` at the very bottom of the file.
3. Insert a comma `,` after the previous closing brace `}`.
4. Add your new object following the standard schema:
   ```json
   {
     "id": "place-sample-park",
     "name": "Sample Public Herbal Garden",
     "category": "Parks & Lakes",
     "description": "Landscaped urban community park with walking pathway.",
     "address": "Hudco Colony, Hosur - 635109",
     "locality": "Hosur City",
     "pincode": "635109",
     "phone": "04344-XXXXXX",
     "latitude": 12.7410,
     "longitude": 77.8300,
     "coordinates": {
       "latitude": 12.7410,
       "longitude": 77.8300
     },
     "sourceUrl": "https://official-source.tn.gov.in/",
     "officialSource": "https://official-source.tn.gov.in/",
     "lastVerified": "2026-11-06",
     "verificationStatus": "verified"
   }
   ```
5. Save the file and run dataset validation:
   ```bash
   npm run validate:data
   ```

---

## 4. How to Edit an Existing Record

1. Find the target record by searching for its `id` or `name`.
2. Update the changed field (e.g., corrected telephone number, updated working hours, or precise coordinates).
3. Update `lastVerified` to the current date (`YYYY-MM-DD`).
4. Ensure valid JSON syntax (remember that trailing commas on the last key of an object are invalid in JSON).
5. Run the validator to ensure no syntax errors were introduced.

---

## 5. Running Dataset Validation

HosurOne includes an automated validation script in `scripts/validateData.js`.

From the repository root or backend folder, run:

```bash
npm run validate:data
```

### What the validator checks:
- Strict JSON syntax and array structure.
- Presence of mandatory required fields (`id`, `name`, `category`, `locality`, `address`).
- ID uniqueness across each file.
- Correct data types (phone numbers must be strings, not numbers).
- Valid coordinate bounds (latitude -90 to 90, longitude -180 to 180, and regional Hosur bounds check).
- Valid HTTP/HTTPS source URL format.
- Valid `YYYY-MM-DD` date formatting for `lastVerified`.
