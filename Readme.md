# HosurOne – Your Region. Your Community. One Portal.

HosurOne is a community-driven digital information portal for the complete Hosur region of Tamil Nadu, India (encompassing Hosur City, Bagalur, Kelamangalam, Denkanikottai, Shoolagiri, Berigai, and Anchetty in Krishnagiri District).

The platform centralizes verified civic administration records, bank branch directories, live atmospheric telemetry, transit guidance, and community updates into an accessible, non-commercial public portal.

---

## Technology Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (Mobile-first responsive design, warm neutral `#faf9f6` background, civic forest green `#065f46` primary identity)
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **Architecture:** Client API services (`weatherApi.js`, `governmentApi.js`, `bankApi.js`) isolating network logic from presentation components.

### Backend
- **Runtime:** Node.js (ES modules)
- **Framework:** Express.js
- **Database:** MongoDB Atlas with Mongoose (graceful stateless in-memory fallback if unconfigured)
- **Caching:** In-memory TTL sliding cache (Open-Meteo telemetry cached for 10 minutes to respect provider quotas)
- **Security & Resilience:** CORS restricted to frontend origins, custom sliding-window rate limiting, centralized error handling without stack trace leakage, input sanitization, and request logging.
- **Testing:** Native Node.js test runner (`node --test`) with 16 automated integration tests.

---

## Repository Structure

```
HosurOne/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js                # Centralized environment validator
│   │   │   └── db.js                 # Resilient MongoDB connection manager
│   │   ├── middleware/
│   │   │   ├── error.middleware.js   # Centralized error handler
│   │   │   ├── notFound.middleware.js# 404 handler
│   │   │   └── rateLimiter.middleware.js # Sliding-window rate limiter
│   │   ├── modules/
│   │   │   ├── weather/              # Weather provider abstraction & Open-Meteo
│   │   │   │   ├── providers/
│   │   │   │   │   ├── weather.provider.js
│   │   │   │   │   └── openmeteo.provider.js
│   │   │   │   ├── weather.controller.js
│   │   │   │   ├── weather.routes.js
│   │   │   │   └── weather.service.js
│   │   │   ├── government/           # Verified municipal & civic directories
│   │   │   │   ├── government.controller.js
│   │   │   │   ├── government.data.js
│   │   │   │   ├── government.model.js
│   │   │   │   ├── government.routes.js
│   │   │   │   └── government.service.js
│   │   │   └── banks/                # Verified bank branch & IFSC finder
│   │   │       ├── bank.controller.js
│   │   │       ├── bank.data.js
│   │   │       ├── bank.model.js
│   │   │       ├── bank.routes.js
│   │   │       └── bank.service.js
│   │   ├── routes/
│   │   │   └── index.js              # Root router mounting /health, /weather, /government, /banks
│   │   ├── utils/
│   │   │   └── weatherCodes.js       # Official WMO weather code translator
│   │   ├── app.js                    # Express app definition
│   │   └── server.js                 # Server entry point with graceful shutdown
│   ├── tests/
│   │   ├── api.test.js               # Health & rate limit tests
│   │   ├── weather.test.js           # Weather telemetry tests
│   │   ├── government.test.js        # Government directory tests
│   │   └── banks.test.js             # Bank finder tests
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Reusable Badges, EmptyState, SectionHeading, SuggestModal
│   │   │   ├── home/                 # Hero, WeatherWidget (top priority), QuickAccess, Discover, Community, Coverage
│   │   │   └── layout/               # Responsive Navbar, Footer
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Redesigned homepage
│   │   │   ├── WeatherPage.jsx       # Dedicated live weather & 7-day outlook
│   │   │   ├── GovernmentPage.jsx    # Verified public services directory
│   │   │   ├── BankPage.jsx          # Verified bank branch & IFSC finder
│   │   │   └── PlaceholderPage.jsx   # Non-misleading roadmap section placeholders
│   │   ├── services/                 # weatherApi.js, governmentApi.js, bankApi.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 1. Backend Setup
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Run automated tests (16 tests)
npm test

# Start the server (runs on http://localhost:5000)
npm run dev   # or npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env

# Run development server (runs on http://localhost:5173)
npm run dev

# Run production build
npm run build
```

---

## Available API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | System status, uptime, environment, and database state |
| `/api/weather` | GET | Real-time Hosur weather telemetry (cached for 10 min, supports `?refresh=true`) |
| `/api/weather/forecast` | GET | Hourly forecast (24h) and 7-day daily forecast with sunrise/sunset |
| `/api/government` | GET | Verified government offices directory (`?search=`, `?category=`, `?locality=`, `?page=`, `?limit=`) |
| `/api/government/:id` | GET | Detail record for a specific government office |
| `/api/banks` | GET | Bank branch directory with IFSC codes (`?search=`, `?bank=`, `?locality=`, `?page=`, `?limit=`) |
| `/api/banks/:id` | GET | Detail record for a specific bank branch by ID or IFSC |

---

## Verified Data Sources

HosurOne enforces strict anti-fabrication standards:
1. **Government Directory:** Verified against public disclosures from the [Hosur City Municipal Corporation](https://www.tnurbantree.tn.gov.in/hosur/), Krishnagiri District Administration, Tamil Nadu Police, TNEB/TANGEDCO, and TNeGA.
2. **Bank Branch Finder:** Verified against the Reserve Bank of India (RBI) Public IFSC Database and official bank locators (State Bank of India, Canara Bank, Indian Bank, HDFC, ICICI, Bank of Baroda, Axis Bank, IOB, Kotak).
3. **Weather Telemetry:** Real-time Automated Weather Station (AWS) telemetry sourced via Open-Meteo for coordinates 12.7409° N, 77.8253° E (Elevation ~862m).

---

## Implemented Modules (Phases 1 – 5)

- [x] **Phase 1: Homepage Redesign:** Modern civic-tech aesthetic, responsive navigation, search entry point, top-priority compact weather widget beneath hero, 8 quick-access tiles, verified discover/community empty states, and comprehensive footer.
- [x] **Phase 2: Backend Architecture & API Foundation:** Express app, rate limiting, CORS configuration, error handling, health endpoint, Mongoose database abstraction with offline fallback.
- [x] **Phase 3: Weather Module:** Provider abstraction (`WeatherProvider` & `OpenMeteoProvider`), 10-minute server caching, `GET /api/weather`, `GET /api/weather/forecast`, dedicated `/weather` page with 24h hourly scroll, 7-day daily outlook, sunrise/sunset, and metrics.
- [x] **Phase 4: Government Information Directory:** Mongoose model, verified seed dataset, multi-criteria filtering (search, category, locality), `GET /api/government`, dedicated `/government` interactive directory page with directions and source attribution links.
- [x] **Phase 5: Bank Branch Finder:** Mongoose model, verified seed dataset (SBI, Canara, Indian Bank, HDFC, ICICI, etc.), IFSC search, copy-to-clipboard functionality, `GET /api/banks`, dedicated `/banks` directory page.

---

## Current Roadmap & Limitations

- **ATM Finder:** Explicitly deferred as an independent module in a future release. The bank finder does not fabricate ATM availability.
- **Places & Transport Directory:** Geocoding and field photography verification are actively ongoing with local volunteers.
- **Language Localization:** English is fully active; Tamil UI translation strings are in active compilation.
- **Community Submissions:** The interactive submission modal is active for logging public recommendations; member authentication and administrative approval workflows will be implemented in Phase 6.
