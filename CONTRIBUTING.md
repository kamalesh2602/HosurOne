# Contributing to HosurOne

Welcome! Thank you for your interest in helping build **HosurOne** — the community-driven digital information portal for the complete Hosur region of Tamil Nadu.

Tagline: **Your Region. Your Community. One Portal.**

HosurOne is not just a government website or a tech demo. It is a genuine public regional knowledge platform created to bring together essential local information for residents, newcomers, students, families, and local businesses across Greater Hosur.

Initially, a close circle of local friends and contributors will populate and verify records. Once our baseline dataset is solid and dependable, we will invite broader participation from regional communities, local forums, and Reddit (`r/tamilnadu`, `r/bangalore`, `r/hosur`).

---

## Geographic Coverage Scope

HosurOne covers the entire Hosur regional sphere, spanning both municipal city wards and surrounding rural taluks:

- **Hosur City** (Central Town, Old Bus Stand, Railway Station, MG Road, Gandhi Statue)
- **SIPCOT Industrial Zones** (Phases 1 & 2, Mookandapalli, Zuzuvadi, Moranapalli)
- **Bagalur** & surrounding border villages
- **Kelamangalam** & Rayakottai approach
- **Denkanikottai** & Thally ("Little England") hill valley
- **Shoolagiri** & the NH44 industrial corridor
- **Berigai** & **Anchetty** border forests
- Developing suburban clusters and panchayats across Krishnagiri District

---

## What You Can Contribute: The 7 Categories

We document public life across 7 balanced categories. **We do not prioritize government offices over local businesses or community spots** — a neighborhood pharmacy or popular breakfast mess is just as vital as a taluk office.

### 1. Healthcare
- **Government Hospitals:** District headquarters hospital, ESI hospital, maternity centers.
- **Private Hospitals & Multi-Specialty Centres:** Emergency casualty, surgical clinics.
- **Clinics & General Practitioners:** Neighborhood doctor clinics, pediatric, dental.
- **Primary Health Centres (PHCs):** Rural 24/7 health centers, vaccination hubs.
- **Pharmacies & Chemists:** 24/7 medical stores, day pharmacies.
- **Diagnostic Centres:** Blood testing labs, scan centers, X-ray facilities.

### 2. Food and Dining
- **Restaurants:** Traditional Tamil messes, banana leaf meals, multi-cuisine dining.
- **Breakfast Spots & Tiffin Centres:** Idli/dosa joints, morning tiffin stalls.
- **Cafes & Bakeries:** Tea stalls, bakeries, coffee rooms, snack spots.
- **Highway Diners:** Family eateries along the NH44 corridor.

### 3. Banks and ATMs
- **Bank Branches:** Public sector and private commercial bank branches with verified IFSC codes.
- **ATMs & Cash Recyclers (CDMs):** 24/7 cash withdrawal points, instant cash deposit machines.

### 4. Explore and Tourism
- **Tourist Attractions:** Reservoirs, waterfalls, dams, valley viewpoints.
- **Parks & Lakes:** Public municipal parks, walking tracks, lake promenades.
- **Temples & Religious Places:** Ancient Chola/Hoysala hill temples, heritage shrines, historic mosques, churches.
- **Historical & Heritage Landmarks:** Memorials, forts, archaeological monuments.
- **Recreation & Sports:** Community grounds, badminton courts, children's play areas.

### 5. Government and Public Services
- **Government Offices:** Municipal corporation ward offices, taluk offices, RTO, revenue inspectors.
- **Public Utilities:** TANGEDCO/TNEB electricity distribution offices, post offices, BSNL offices.
- **Public Safety:** Police stations (Town, SIPCOT, All Women, Traffic), Fire & Rescue control rooms.
- **Emergency Helplines:** 24/7 emergency dispatch numbers (108, 112, 101, 1091, municipal toll-free).

### 6. Transport and Connectivity
- **Bus Stands & Terminals:** Hosur M.G.R. Central Bus Stand platforms, suburban bus shelters.
- **Bus Stops & Key Routes:** Town bus boarding points across Bagalur, Mathigiri, Kelamangalam.
- **Railway Facilities:** Hosur Railway Station entrance, auto stands, passenger amenities.
- **Auto & Taxi Stands:** Designated local auto stands and taxi booking points.

### 7. Other Local Places
- **Retail & Bazaars:** Weekly farmers markets (Santha), flower markets, handloom outlets.
- **Community Facilities:** Public libraries, community halls (Kalyana Mandapams), burial/cremation grounds.
- **Useful Local Services:** Vehicle repair garages, courier offices, tailoring, photocopy/DTP centers.

---

## The Golden Rule: Never Fabricate Information

HosurOne is built on trust:

> [!CAUTION]
> **Zero Guesswork Rule:**
> - NEVER invent or guess a contact phone number, address, opening time, or coordinate.
> - If you do not know a phone number or website, **leave the field blank or omit it**.
> - An incomplete but 100% verified record is infinitely better than a complete record with fabricated details.

---

## How to Verify Information Before Contributing

1. **Physical Observation:** You walked past the place, visited it, or saw its official signboard.
2. **Official Receipts or Notices:** Invoices, visiting cards, municipal circulars, gazette orders.
3. **Official Websites:** Government portals (`.tn.gov.in`, `.gov.in`, `.nic.in`), bank locators (`sbi.bank.in`, `canarabank.com`).
4. **OpenStreetMap (OSM):** You can use OpenStreetMap as a reference tool to discover street layouts and coordinate points.
5. **Direct Confirmation:** You called the public telephone number or verified hours with staff.

---

## How to Check for Duplicates

Before submitting a new record, ensure it is not already present:
1. Search the files in the [`data/`](file:///c:/Users/ELCOT/Desktop/HosurOne/data) folder (`places.json`, `hospitals.json`, `banks.json`, `atms.json`, `government.json`, `contacts.json`).
2. Search within the HosurOne application search bar on the `/explore` or `/government` pages.
3. Check geographic proximity: if a facility with the same name exists within 50 meters, it is almost certainly the same place. Suggest a correction instead of adding a new record.

---

## How to Contribute

You do not need to be a software developer to contribute to HosurOne! Choose whichever path feels easiest:

### Method 1: GitHub Issues (Easiest for Beginners – No Code Needed)

1. Go to the [HosurOne GitHub Issues page](https://github.com/kamalesh2602/HosurOne/issues).
2. Click **New Issue**.
3. Select one of our pre-built issue forms:
   - **New Place / Facility Submission**: To add a missing place.
   - **Existing Listing Correction**: To fix outdated hours, wrong numbers, or relocated spots.
   - **Data Issue / Missing Information**: To report missing regions or broken coordinates.
4. Fill in the form fields with what you know and click **Submit new issue**.
5. Our volunteer team will review the information, validate it, and merge it into the datasets.

### Method 2: Direct GitHub Web Editor (Quick for Editing a JSON File)

1. Open the [`data/`](file:///c:/Users/ELCOT/Desktop/HosurOne/data) directory on GitHub.
2. Click on the relevant file (e.g. `data/places.json` or `data/hospitals.json`).
3. Click the pencil icon (**Edit this file**) in the top right.
4. Scroll to the end of the array, add a comma after the last record, and paste your new JSON record following the schema.
5. Under **Commit changes**, write a short summary (e.g. `Add Bagalur Herbal Garden to places.json`).
6. Select **Create a new branch for this commit and start a pull request** and click **Propose changes**.

### Method 3: Git Pull Request (For Developers)

1. Fork the repository to your GitHub account.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/HosurOne.git
   cd HosurOne
   ```
3. Create a descriptive feature branch:
   ```bash
   git checkout -b contrib/add-denkanikottai-parks
   ```
4. Add or update records inside `data/*.json`.
5. Run the data validation script:
   ```bash
   npm run validate:data
   ```
   Ensure the output reports `0 errors`.
6. Commit your changes:
   ```bash
   git add data/
   git commit -m "data: add Denkanikottai botanical park and Lake view"
   ```
7. Push to your fork and submit a Pull Request to `main`.

---

## How to Submit Photographs

Photographs make places tangible and welcoming for residents.

- **Must be original:** You took the photo yourself, or have explicit written permission from the photographer.
- **No copyright infringement:** Never copy photos from Google Maps user reviews, commercial food blogs, or watermarked studio websites.
- **Lighting and Clarity:** Exterior facades showing the building entrance and signboard are best.
- **Format:** High resolution JPEG or WebP, unwatermarked.
- **Submission:** Attach the image directly to your GitHub Issue or link to a cloud folder in your Pull Request.

---

## Review Process & Contributor Recognition

- **Review turnaround:** Submissions are usually reviewed within 24 to 48 hours.
- **Automated Validation:** Every Pull Request runs `npm run validate:data` to verify valid syntax, required fields, and coordinate bounds.
- **Community Credit:** All contributors who submit verified records will be listed in our `CONTRIBUTORS.md` roll of honor and release notes.

Thank you for helping map and preserve the living civic memory of Hosur!
