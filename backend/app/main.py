from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from .database import init_db, get_db
from .routes import csv_router, reports_router, status_router

load_dotenv()

app = FastAPI(title="CSV Insights Dashboard API")

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup():
    init_db()

# Include routers
app.include_router(csv_router, prefix="/api/csv", tags=["CSV"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])
app.include_router(status_router, prefix="/api/status", tags=["Status"])

@app.get("/")
async def root():
    return {"message": "CSV Insights Dashboard API", "version": "1.0.0"}
