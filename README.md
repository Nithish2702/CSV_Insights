# 📊 CSV Insights Dashboard

> AI-powered CSV analysis tool for generating actionable insights from your data

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)

## 🎯 Overview

CSV Insights Dashboard is a full-stack web application that helps you quickly analyze CSV data using AI. Upload a file, get instant insights about trends, outliers, and data quality, then export your findings.

**Live Demo**: [Your deployed URL here]  
**GitHub**: [Your repository URL here]

## ✨ Features

- 📤 **CSV Upload & Preview** - Upload files and see your data instantly
- 🤖 **AI-Powered Insights** - Get trends, outliers, and recommendations from GPT-4
- 📚 **Report History** - Access your last 5 analysis reports
- 💾 **Export Options** - Download as text or markdown
- 📊 **Data Visualization** - View statistics and summaries
- 🏥 **Health Monitoring** - Check system status in real-time

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **Backend** | FastAPI, Python 3.9+ |
| **Database** | Supabase (PostgreSQL) |
| **AI/LLM** | Google Gemini (gemini-1.5-flash) |
| **Data Processing** | Pandas |
| **Deployment** | Docker, Vercel, Railway |

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Google Gemini API key (get one at https://aistudio.google.com/app/apikey)
- Supabase account (free at https://supabase.com)

### Quick Start with Docker (Recommended)

1. Clone the repository
2. Set up Supabase (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))
3. Create a `.env` file in the root directory:
```bash
GOOGLE_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

4. Run with Docker Compose:
```bash
docker-compose up --build
```

5. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Manual Setup

#### Backend Setup

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and add:
# - GOOGLE_API_KEY (from Google AI Studio)
# - DATABASE_URL (from Supabase - see SUPABASE_SETUP.md)
uvicorn app.main:app --reload
```

Backend runs on http://localhost:8000

**Note**: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed Supabase configuration.

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed (default API URL is http://localhost:8000)
npm run dev
```

Frontend runs on http://localhost:3000

## Usage

1. Navigate to the home page
2. Upload a CSV file
3. Preview the data in table view
4. Click "Generate Insights" to get AI analysis
5. Edit, save, or export the report
6. View past reports in the Reports section
7. Check system health at /status

## What's Done

- ✅ CSV upload and parsing with NaN handling
- ✅ Data preview with pagination
- ✅ AI insights generation using Gemini
- ✅ Report saving and history (last 5)
- ✅ Report deletion functionality
- ✅ Export functionality (markdown/text)
- ✅ Status page with health checks
- ✅ Clickable report cards for full view
- ✅ Error handling and validation

## What's Not Done

- Advanced filtering/sorting in table view
- Real-time collaboration
- User authentication
- Large file streaming (>10MB)
- Custom chart configuration
- Data visualization charts

## 📁 Project Structure

```
csv-insights-dashboard/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── main.py      # App entry & CORS
│   │   ├── routes.py    # API endpoints
│   │   ├── services.py  # Business logic
│   │   └── database.py  # SQLAlchemy models
│   └── requirements.txt
├── frontend/            # React application
│   ├── src/
│   │   ├── pages/       # Route components
│   │   ├── components/  # Reusable UI
│   │   └── api.ts       # API client
│   └── package.json
├── sample-data/         # Test CSV files
├── README.md
├── DEPLOYMENT.md        # Hosting guide
├── TESTING.md          # QA checklist
└── docker-compose.yml
```

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# 1. Clone and setup
git clone <your-repo>
cd csv-insights-dashboard

# 2. Add your OpenAI key
echo "OPENAI_API_KEY=your_key_here" > .env

# 3. Start everything
docker-compose up
```

### Option 2: Manual Setup
See detailed instructions in the Setup section below.

## 📚 Documentation

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Supabase database setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy to production
- **[TESTING.md](TESTING.md)** - Testing checklist and guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Common commands and tips
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Architecture details
- **[AI_NOTES.md](AI_NOTES.md)** - AI usage documentation
- **[PROMPTS_USED.md](PROMPTS_USED.md)** - Development prompts

## 🎮 Usage

1. **Upload CSV**: Click "Choose File" and select your CSV
2. **Preview Data**: Review the table with your data
3. **Generate Insights**: Click the button to analyze with AI
4. **Review Results**: See trends, outliers, and recommendations
5. **Export**: Download as text or markdown
6. **View History**: Check past reports in the Reports page

## 🔧 Configuration

## Environment Variables

See `.env.example` files in backend and frontend directories.

## License

MIT


### Backend Configuration

Edit `backend/.env`:
```bash
GOOGLE_API_KEY=AIza...                   # Required: Your Gemini API key
DATABASE_URL=postgresql://...            # Required: Supabase connection
CORS_ORIGINS=http://localhost:3000       # Required: Allowed origins
MAX_FILE_SIZE_MB=10                      # Optional: Upload limit
```

### Frontend Configuration

Edit `frontend/.env`:
```bash
VITE_API_URL=http://localhost:8000  # Backend API URL
```

## 🧪 Testing

Run the test suite:
```bash
# Test with sample data
curl -X POST http://localhost:8000/api/csv/upload \
  -F "file=@sample-data/sales_data.csv"

# Check system health
curl http://localhost:8000/api/status/
```

See [TESTING.md](TESTING.md) for complete testing guide.

## 🌐 Deployment

### Recommended: Vercel + Railway

**Frontend (Vercel)**
1. Connect GitHub repository
2. Set root directory: `frontend`
3. Add environment variable: `VITE_API_URL`
4. Deploy

**Backend (Railway)**
1. Connect GitHub repository
2. Set root directory: `backend`
3. Add environment variables: `OPENAI_API_KEY`, `CORS_ORIGINS`
4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions and alternatives.

## 🐛 Troubleshooting

### Backend won't start
- Verify Python 3.9+ installed
- Check `.env` file exists with valid `OPENAI_API_KEY`
- Run `pip install -r requirements.txt`

### Frontend won't start
- Verify Node.js 18+ installed
- Run `npm install` in frontend directory
- Check port 3000 is available

### CORS errors
- Ensure `CORS_ORIGINS` in backend `.env` includes frontend URL
- Restart backend after changing environment variables

### Insights generation fails
- Verify Gemini API key is valid
- Get a free key at: https://aistudio.google.com/app/apikey
- Check API quota limits
- Review backend logs for detailed errors

## 📝 API Documentation

Interactive API docs available at: http://localhost:8000/docs

### Key Endpoints

- `POST /api/csv/upload` - Upload CSV file
- `POST /api/csv/insights` - Generate insights
- `GET /api/reports/` - Get last 5 reports
- `GET /api/reports/{id}` - Get specific report
- `DELETE /api/reports/{id}` - Delete a report
- `GET /api/status/` - System health check

## 🤝 Contributing

This is a submission project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project as a template or learning resource.

## 👤 Author

See [ABOUTME.md](ABOUTME.md) for author information and resume.

## 🙏 Acknowledgments

- Google for Gemini API
- FastAPI for the excellent Python framework
- React team for the frontend library
- Supabase for database hosting
- Vercel and Railway for hosting platforms

## 📞 Support

For issues or questions:
1. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. Review [TESTING.md](TESTING.md)
3. Check API docs at `/docs`
4. Open an issue on GitHub

---

**Built with ❤️ for the CSV Insights Dashboard project**
