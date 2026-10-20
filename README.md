# LinguaFlow AI

**Write naturally. Communicate globally.**

LinguaFlow AI is an AI-powered Chrome extension that helps users rewrite messages in different writing styles. Built with HTML, CSS, JavaScript, FastAPI, and Google's Gemini API, it transforms text while aiming to preserve the original meaning and intent.

## Features

- **Professional Mode** — Rewrite messages in a polished, professional tone.
- **Casual Mode** — Make messages sound friendly and natural.
- **Grammar Correction** — Correct grammar, spelling, and punctuation.
- **Character Counter** — Track message length while typing.
- **Copy Result** — Copy the generated message.
- **Clear Input** — Clear the message and result.
- **AI Status Indicator** — Display conversion status in the extension.
- **Multilingual Input** — Designed for English, Marathi, and Hinglish input. Output quality may vary by language.

## Screenshots

### Professional Mode

Rewrite messages into a polite, professional tone.

![LinguaFlow AI Professional Mode](screenshots/professional.png)

### Casual Mode

Make messages sound friendly and natural.

![LinguaFlow AI Casual Mode](screenshots/casual.png)

### Grammar Correction

Correct grammar while preserving the original meaning.

![LinguaFlow AI Grammar Correction](screenshots/Grammar-correction.png)

## Technology Stack

| Component | Technology |
|---|---|
| Browser Extension | Chrome Extension Manifest V3 |
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| AI Integration | Google Gemini API |
| API Server | Uvicorn |
| Configuration | Environment variables and `python-dotenv` |
| Version Control | Git and GitHub |
| Backend Hosting | Render |

## Architecture

1. The user enters a message and selects a writing mode in the Chrome extension.
2. The extension sends the message and selected mode to the FastAPI backend.
3. The backend validates the input and constructs instructions for the selected mode.
4. The backend sends the request to the Gemini API.
5. The generated text is returned to the extension and displayed to the user.

## Project Structure

```text
LinguaFlow-AI/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env                 # Local secret; not committed
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── screenshots/
│   ├── professional.png
│   ├── casual.png
│   └── Grammar-correction.png
├── manifest.json
├── .gitignore
├── LICENSE
└── README.md
```

The `.env` file must be created locally and must never contain a key that is committed to the repository.

## Getting Started

### Prerequisites

- Google Chrome
- Python compatible with the project's dependencies
- A Google Gemini API key
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/tejas243/LinguaFlow-AI.git
cd LinguaFlow-AI
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure the Gemini API Key

Create a file named `.env` inside the `backend/` directory:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

Replace the placeholder with your own Gemini API key. Never commit or share the actual key.

For the deployed service, configure `GEMINI_API_KEY` in the Render dashboard's environment settings.

### 4. Start the Local Backend

From the `backend/` directory, run:

```bash
python -m uvicorn main:app --reload
```

The local API will be available at:

- **API root:** http://127.0.0.1:8000/
- **Health check:** http://127.0.0.1:8000/health
- **Interactive API documentation:** http://127.0.0.1:8000/docs

Keep the backend running while using the extension with the local API.

### 5. Load the Chrome Extension

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the project root directory containing `manifest.json`.
5. Open LinguaFlow AI and test the available writing modes.

**Note:** The extension's configured API URL and the backend's CORS settings must match the environment you are using. The deployed version uses the Render backend, while local development can use the local API.

## API Endpoint

### `POST /api/convert`

Example request:

```json
{
  "text": "i am go to college yesterday and meet my friend",
  "mode": "grammar"
}
```

Supported modes:

- `professional`
- `casual`
- `grammar`

A successful response contains the status, selected mode, and generated result.

## Security Notes

- Keep the Gemini API key in `backend/.env` for local development.
- Never commit `.env`, virtual environments, or other secrets.
- Configure production secrets through the hosting provider's environment settings.
- Protect the public API against abuse with appropriate rate limiting and usage controls.
- Do not expose the Gemini API key in extension JavaScript or other client-side files.

## Current Status

The Chrome extension, Gemini-backed FastAPI integration, and Render deployment have been tested. All three writing modes have been manually tested successfully.

## Future Improvements

- Add automated tests for the API and extension workflows.
- Improve multilingual output consistency.
- Add rate limiting and production-grade monitoring.
- Improve error handling and API reliability.
- Explore a Chrome Web Store release.
- Add additional language support and writing styles.

## License

This project includes an MIT license file. See [`LICENSE`](LICENSE) for the applicable terms.
