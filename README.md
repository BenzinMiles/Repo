# Infecto-Shell

A hybrid mobile application (Android APK) built with React + Vite + Tailwind CSS and wrapped in Capacitor. Designed as an interactive reference guide for infectious disease specialists.

## 🚀 Project Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Android**
    ```bash
    npm run build
    npx cap sync
    npx cap open android
    ```
    *Note: Opening the Android project requires Android Studio to be installed.*

## 📂 Data Management

The application loads data from JSON files located in the `src/data/` directory. You can add new content by creating new JSON files in the respective subfolders.

### 1. Diseases (`src/data/diseases/`)
Create a new file, e.g., `src/data/diseases/covid19.json`.

**Template:**
```json
{
  "id": "unique_id_slug",
  "category": { "lv": "Category LV", "en": "Category EN" },
  "title": { "lv": "Title LV", "en": "Title EN" },
  "color": "bg-blue-100 border-blue-300",
  "symptoms": {
    "lv": ["Symptom 1", "Symptom 2"],
    "en": ["Symptom 1", "Symptom 2"]
  },
  "redFlags": {
    "lv": "Red flags description...",
    "en": "Red flags description..."
  },
  "diagnostics": {
    "lv": ["Brief diagnostic info"],
    "en": ["Brief diagnostic info"]
  },
  "treatment": {
    "lv": ["Brief treatment info"],
    "en": ["Brief treatment info"]
  },
  "details": {
    "etiology": { "lv": "...", "en": "..." },
    "pathogenesis": { "lv": "...", "en": "..." },
    "clinical": { "lv": "...", "en": "..." },
    "diagnostics_full": { "lv": "...", "en": "..." },
    "treatment_full": { "lv": "...", "en": "..." },
    "hospitalization": { "lv": "...", "en": "..." },
    "risk_groups": { "lv": "...", "en": "..." },
    "recommendations": { "lv": "...", "en": "..." }
  }
}
```

### 2. Medications (`src/data/medications/`)
Create a new file, e.g., `src/data/medications/paracetamol.json`.

**Template:**
```json
{
  "id": "paracetamol",
  "title": { "lv": "Paracetamols", "en": "Paracetamol" },
  "group": { "lv": "Analgetics", "en": "Analgetics" },
  "adult_dosage": {
    "lv": "500-1000 mg every 4-6h",
    "en": "500-1000 mg every 4-6h"
  },
  "pediatric_dosage": {
    "lv": "10-15 mg/kg every 4-6h",
    "en": "10-15 mg/kg every 4-6h"
  },
  "contraindications": {
    "lv": "Severe liver failure.",
    "en": "Severe liver failure."
  }
}
```

### 3. Tests / Quizzes (`src/data/tests/`)
Create a new file, e.g., `src/data/tests/quiz_1.json`. The file should contain an array of question arrays.

**Template:**
```json
[
  [
    "Question Text?",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Correct Option Text (must match exactly)",
    "Explanation text displayed after answering."
  ]
]
```

## ⚠️ Building & Bundling
If you encounter "No modules supporting bundles found" in Android Studio:
1. Ensure you have run `npm run build` at least once.
2. Ensure `dist/` directory exists.
3. Run `npx cap sync`.
4. Check your Run Configuration in Android Studio (Select 'app').
