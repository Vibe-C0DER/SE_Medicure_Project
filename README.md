# MediCure

## Description

MediCure is a modern, full-stack healthcare platform and advanced symptom checker. The application empowers users to manage their health proactively by inputting their symptoms and receiving accurate disease predictions powered by an AI engine. It offers secure authentication, comprehensive personal health reports in PDF format, a built-in health article library, and a geographical specialist finder to locate relevant doctors nearby. For platform administrators, MediCure features a complete dashboard to manage users, medical data (diseases and symptoms), reports, user feedback, and published articles, along with insightful platform statistics.

### Problem it solves
Many individuals struggle to understand their symptoms before consulting a doctor, often relying on unverified internet searches that cause anxiety. MediCure provides an intelligent, AI-backed, and structured preliminary diagnosis tool. It bridges the gap between experiencing symptoms and finding the right medical specialist, while maintaining a secure record of health reports and providing curated health-related educational content.

## Features

- **Symptom Checker & Prediction Engine:** Input symptoms to receive AI-powered disease predictions, potential causes, and recommended actions.
- **Specialist Finder (Map Integration):** Interactive map powered by Google Maps API to locate relevant medical specialists nearby based on predicted conditions.
- **Health Reports Management:** Automatically generate, view, and download detailed prediction reports in PDF format.
- **Knowledge Base / Articles:** A dedicated blogging section for users to read health articles and for admins to publish content using Markdown.
- **Secure Authentication:** Robust user authentication system including standard email/password login, Google OAuth integration, password reset, and JWT-based session management.
- **Comprehensive Admin Dashboard:** Manage the platform's core data including diseases, symptoms, reports, users, support contacts, and articles. Includes statistical visualizations.
- **Automated Weekly Digest:** Scheduled chron jobs to send personalized weekly health digests and platform updates to users via email.
- **Responsive & Modern UI:** A fully responsive, aesthetically pleasing interface built with Tailwind CSS and dynamic components.

## Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS, PostCSS, Autoprefixer
- **State Management:** Redux Toolkit, Redux Persist
- **Routing:** React Router DOM
- **Maps:** `@react-google-maps/api`
- **Charts:** Recharts (for admin dashboard analytics)
- **Validation:** Zod
- **Other Utilities:** Axios, React Markdown, `@react-oauth/google`

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5.x
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens), bcryptjs, Google Auth Library
- **AI Integration:** Google Generative AI (`@google/generative-ai`)
- **Email Services:** Nodemailer (with node-cron for scheduled jobs)
- **File Generation:** PDFKit (for generating downloadable health reports)
- **Utilities:** CORS, cookie-parser, dotenv

## Project Structure

```text
SE_Medicure_Project/
│
├── Backend/                 # Node.js Express Backend
│   ├── controllers/         # Request handlers for API routes
│   ├── db/                  # MongoDB connection logic
│   ├── errors/              # Custom error handling classes
│   ├── jobs/                # Scheduled background jobs (e.g., cron jobs)
│   ├── middlewares/         # Express middlewares (Auth, Error handler, etc.)
│   ├── models/              # Mongoose database schemas (User, Disease, Symptom, etc.)
│   ├── routes/              # API route definitions (User, Admin, AI, Predict, etc.)
│   ├── services/            # Core business logic and external API integrations
│   ├── utils/               # Helper utilities
│   ├── index.js             # Entry point of the Express server
│   └── package.json         # Backend dependencies and scripts
│
└── frontend/                # React Vite Frontend
    ├── src/
    │   ├── api/             # Axios instance and API call wrappers
    │   ├── components/      # Reusable UI components (Buttons, Modals, Navbars)
    │   ├── pages/           # Main route views (Home, Login, SymptomInput, Admin Dashboard)
    │   ├── store/           # Redux slices and store configuration
    │   ├── utils/           # Frontend helper functions
    │   ├── App.jsx          # Root React component with Routing logic
    │   ├── main.jsx         # React DOM rendering entry point
    │   └── index.css        # Global CSS and Tailwind directives
    ├── index.html           # Main HTML template
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── vite.config.js       # Vite bundler configuration
    └── package.json         # Frontend dependencies and scripts
```

## Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)
- Google Cloud Console Account (for Google Maps API Key and OAuth Credentials)
- Google Gemini API Key

### Step-by-step setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SE_Medicure_Project
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Variables

### Backend (`Backend/.env`)
Create a `.env` file in the `Backend` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_ORIGIN=http://localhost:5173

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id

# AI Service
GEMINI_API_KEY=your_google_gemini_api_key

# Email Service (Nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## Usage

### Running the Project Locally

1. **Start the Backend Server:**
   Open a terminal, navigate to the `Backend` folder, and run:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`.

2. **Start the Frontend Application:**
   Open a new terminal, navigate to the `frontend` folder, and run:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

3. **Access the App:**
   Open your browser and navigate to `http://localhost:5173`.

## Known Issues / Limitations
- The accuracy of disease prediction relies entirely on the underlying AI model (Google Generative AI) and should not be treated as a definitive medical diagnosis.
- The Specialist Map feature requires a valid Google Maps API Key with Places API enabled; otherwise, it will fail to load or display generic data.
- PDF Report generation styling is static and might clip on extremely long prediction responses.

## Future Improvements
- **Mobile Application:** Port the frontend to React Native for native iOS/Android support.
- **Telemedicine Integration:** Add real-time chat and video consultation features to connect users directly with specialists.
- **Wearable Integration:** Sync health data from fitness trackers (Apple Health, Google Fit) for more accurate symptom context.
- **Multi-language Support:** Introduce i18n to support multiple languages across the platform.

## Contributing Guidelines
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please ensure that your code adheres to the existing styling and includes appropriate tests if applicable.


## Author / Credits
**Developed by:**

**Group 8**
- 202512023 — Kush Dani
- 202512026 — Darshan Prajapati
- 202512093 — Mayank Jayswal
- 202512115 — Rohit Peswani

