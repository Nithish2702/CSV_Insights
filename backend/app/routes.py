from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
import pandas as pd
import json
import os
from datetime import datetime
from .database import get_db, Report
from .services import parse_csv, generate_insights, check_gemini_connection

csv_router = APIRouter()
reports_router = APIRouter()
status_router = APIRouter()

@csv_router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    """Upload and parse CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        contents = await file.read()
        df, stats, preview_data = parse_csv(contents)
        
        return {
            "filename": file.filename,
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": df.columns.tolist(),
            "preview": preview_data,
            "stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")

@csv_router.post("/insights")
async def get_insights(data: dict, db: Session = Depends(get_db)):
    """Generate AI insights from CSV data"""
    try:
        insights = await generate_insights(data)
        
        # Save report
        report = Report(
            filename=data.get("filename", "unknown.csv"),
            rows=data.get("rows", 0),
            columns=data.get("columns", 0),
            column_names=json.dumps(data.get("column_names", [])),
            summary_stats=json.dumps(data.get("stats", {})),
            insights=json.dumps(insights)
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        
        return {
            "report_id": report.id,
            "insights": insights,
            "created_at": report.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@reports_router.get("/")
async def get_reports(db: Session = Depends(get_db)):
    """Get last 5 reports"""
    reports = db.query(Report).order_by(Report.created_at.desc()).limit(5).all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "rows": r.rows,
            "columns": r.columns,
            "created_at": r.created_at.isoformat(),
            "insights": json.loads(r.insights) if r.insights else {}
        }
        for r in reports
    ]

@reports_router.get("/{report_id}")
async def get_report(report_id: int, db: Session = Depends(get_db)):
    """Get specific report"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {
        "id": report.id,
        "filename": report.filename,
        "rows": report.rows,
        "columns": report.columns,
        "column_names": json.loads(report.column_names) if report.column_names else [],
        "stats": json.loads(report.summary_stats) if report.summary_stats else {},
        "insights": json.loads(report.insights) if report.insights else {},
        "created_at": report.created_at.isoformat()
    }

@reports_router.delete("/{report_id}")
async def delete_report(report_id: int, db: Session = Depends(get_db)):
    """Delete a specific report"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    
    return {"message": "Report deleted successfully", "id": report_id}

@status_router.get("/")
async def get_status(db: Session = Depends(get_db)):
    """Check system health"""
    status = {
        "backend": "healthy",
        "database": "unknown",
        "llm": "unknown",
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Check database
    try:
        db.execute(text("SELECT 1"))
        status["database"] = "healthy"
    except Exception as e:
        status["database"] = f"unhealthy: {str(e)}"
    
    # Check Gemini
    try:
        llm_status = await check_gemini_connection()
        status["llm"] = llm_status
    except Exception as e:
        status["llm"] = f"unhealthy: {str(e)}"
    
    return status
