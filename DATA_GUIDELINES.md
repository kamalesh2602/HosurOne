# HosurOne Data Quality Guidelines

This document specifies the standards, schemas, and ethical conventions required for records published in the **HosurOne** regional directory.

---

## 1. Core Principles

1. **Anti-Fabrication Guarantee:** Every single field published in HosurOne must correspond to physical ground truth or verified official disclosures. If an opening hour or phone number cannot be verified, it must remain omitted.
2. **Public Interest Focus:** Only publish information that serves public utility (public facilities, business services, landmarks, healthcare). Never publish unlisted private residence numbers or non-public personal contacts.
3. **Regional Sensitivity:** Preserve original Tamil transliterations and local colloquial place names (e.g., *Malai Kovil*, *Ramanaicken Lake*, *Taluk Office Road*) alongside standardized English spellings.
4. **Permanent Attribution:** Every record should reference its provenance — whether an official gazette, municipal portal, direct on-site visit, or contributor verification.

---

## 2. Standard Record Schema

Each entry in `data/*.json` is a JSON object adhering to the following structure:

```json
{
  "id": "category-prefix-unique-slug",
  "name": "Official Full Name of Facility",
  "category": "Standardized Category Name",
  "description": "Clear, factual 1-3 sentence summary of services or landmark significance.",
  "address": "Door number, Street name, Landmark, Town/Village - Pincode",
  "locality": "Regional Locality or Taluk",
  "pincode": "635109",
  "phone": "04344-XXXXXX",
  "website": "https://example.com/",
  "latitude": 12.7383,
  "longitude": 77.8286,
  "coordinates": {
    "latitude": 12.7383,
    "longitude": 77.8286
  },
  "sourceUrl": "https://official-source.gov.in/",
  "lastVerified": "2026-11-06",
  "verificationStatus": "verified"
}
```

---

## 3. Field-by-Field Quality Rules

### `id` (Required • String)
- **Convention:** Lowercase alphanumeric characters separated by hyphens.
- **Prefix format:** `<category-prefix>-<entity-name>-<optional-locality>`
  - Places: `place-chandrachoodeswarar-temple`
  - Hospitals: `hosp-kelamangalam-phc`
  - Banks: `bank-sbi-sipcot`
  - ATMs: `atm-canara-mg-road`
  - Government: `gov-hosur-rto`
  - Contacts: `cont-medical-108`
- **Rule:** Must be globally unique across the dataset and permanent (do not change IDs once assigned, as URLs or bookmark references depend on them).

### `name` (Required • String)
- Use the formal, complete display name as written on the building's exterior signboard or official registration.
- Include Tamil regional names in parentheses where helpful (e.g. `Arulmigu Maragathambigai Chandra Choodeswarar Temple`).
- Avoid promotional superlatives ("Best Tea Stall in Hosur", "No. 1 Hospital").

### `category` (Required • String)
- Must match one of the recognized regional taxonomy categories:
  - **Healthcare:** `Government Hospital`, `Private Hospital`, `Primary Health Centre`, `Clinic`, `Pharmacy`, `Diagnostic Centre`
  - **Places & Tourism:** `Parks & Lakes`, `Tourist Attraction`, `Religious Place`, `Historical & Heritage`, `Recreation & Sports`
  - **Banking:** `Bank Branch`, `ATM`
  - **Public Services:** `Municipal Corporation`, `Taluk & Revenue`, `Police Station`, `Electricity Office`, `Post Office`, `E-Sevai Centre`
  - **Emergency:** `Emergency Services`, `Municipal Helplines`, `Public Utilities`, `Women & Child Safety`
  - **Dining & Commerce:** `Restaurant`, `Cafe & Bakery`, `Local Market`, `Retail Store`

### `locality` (Required • String)
- Assign the accurate regional sub-region:
  - `Hosur City` / `Hosur Main`
  - `SIPCOT`
  - `Mookandapalli`
  - `Bagalur`
  - `Mathigiri`
  - `Kelamangalam`
  - `Denkanikottai`
  - `Shoolagiri`
  - `Berigai`
  - `Anchetty`
  - `Thally`
  - `All Hosur Region` (strictly for region-wide emergency toll-free helplines)

### `address` (Required • String)
- Full physical street address ending with the 6-digit Tamil Nadu postal pincode.
- Always include a recognizable nearby landmark (e.g. `Near Old Bus Stand`, `Opp. SIPCOT Phase 1 Arch`).

### `phone` / `contact` (Optional • String)
- Format landlines with the STD area code: `04344-XXXXXX` (Hosur STD: `04344`, Denkanikottai/Kelamangalam STD: `04347`).
- Format toll-free helplines with hyphens: `1800-425-4243`.
- Format emergency numbers: `108`, `112`, `101`, `181`.
- **Privacy check:** Never publish a private mobile number unless it is explicitly designated as the official public inquiry line for that facility.

### `latitude` and `longitude` (Optional • Number)
- Only provide coordinates when verified on an actual map or GPS readout.
- Precision: 4 to 6 decimal places (e.g., `12.7383`, `77.8286`).
- Geographic bounding box: Hosur region coordinates strictly range between **12.40° N to 13.00° N** and **77.60° E to 78.20° E**. Coordinates outside this range will be flagged by automated validation.
- Flat fields and nested `coordinates: { latitude, longitude }` are maintained in synchronization.

### `sourceUrl` / `officialSource` (Optional • URL)
- Full URL beginning with `https://` or `http://` pointing to where the listing was verified.
- Preferred sources: Government portals (`.gov.in`, `.nic.in`), bank locators, HR&CE temple registries, or municipal directories.

### `lastVerified` (Optional • Date String)
- Formatted as `YYYY-MM-DD` (e.g., `2026-11-06`).
- Denotes the most recent date a human contributor confirmed the details are active.

### `verificationStatus` (Required • String)
- `verified`: Information confirmed against official government portals, bank locators, or on-site volunteer inspection.
- `community_submitted`: Information submitted by a community resident, pending secondary corroboration.

---

## 4. Duplicate Prevention Protocol

Before creating a new record:
1. Search by name (case-insensitive) in all `data/*.json` files.
2. Check if a nearby listing exists within a 50-meter radius using Haversine calculation.
3. If an existing listing is found, submit an **Existing Listing Correction** rather than creating a duplicate file entry.

---

## 5. Automated Data Validation

Every change to the dataset must pass the validation suite:

```bash
npm run validate:data
```

The validator confirms JSON syntax, required fields, unique IDs, coordinate ranges, and URL formats. Pull requests with validation errors cannot be merged.
