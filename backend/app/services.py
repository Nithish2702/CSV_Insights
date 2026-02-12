import pandas as pd
import io
import os
import google.generativeai as genai
import json

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

def parse_csv(contents: bytes):
    """Parse CSV and generate statistics"""
    try:
        # Try different encodings
        for encoding in ['utf-8', 'latin-1', 'iso-8859-1']:
            try:
                df = pd.read_csv(io.BytesIO(contents), encoding=encoding)
                break
            except UnicodeDecodeError:
                continue
        else:
            raise ValueError("Unable to decode CSV file")
        
        # Generate statistics
        stats = {
            "numeric_columns": [],
            "categorical_columns": [],
            "missing_values": {}
        }
        
        for col in df.columns:
            missing = df[col].isna().sum()
            if missing > 0:
                stats["missing_values"][col] = int(missing)
            
            if pd.api.types.is_numeric_dtype(df[col]):
                stats["numeric_columns"].append({
                    "name": col,
                    "min": float(df[col].min()) if not df[col].isna().all() else None,
                    "max": float(df[col].max()) if not df[col].isna().all() else None,
                    "mean": float(df[col].mean()) if not df[col].isna().all() else None,
                    "median": float(df[col].median()) if not df[col].isna().all() else None
                })
            else:
                unique_count = df[col].nunique()
                stats["categorical_columns"].append({
                    "name": col,
                    "unique_values": int(unique_count),
                    "top_values": df[col].value_counts().head(5).to_dict()
                })
        
        # Convert DataFrame to dict and replace NaN with None for JSON serialization
        preview_data = df.head(10).replace({pd.NA: None, float('nan'): None}).to_dict('records')
        
        return df, stats, preview_data
    except Exception as e:
        raise ValueError(f"Error parsing CSV: {str(e)}")

async def generate_insights(data: dict):
    """Generate insights using Gemini"""
    prompt = f"""Analyze this CSV data and provide insights:

Filename: {data.get('filename')}
Rows: {data.get('rows')}
Columns: {data.get('columns')}
Column Names: {', '.join(data.get('column_names', []))}

Statistics:
{json.dumps(data.get('stats', {}), indent=2)}

Sample Data (first few rows):
{json.dumps(data.get('preview', [])[:5], indent=2)}

Please provide:
1. Key Trends: What patterns do you see in the data?
2. Outliers: Any unusual values or anomalies?
3. Data Quality: Missing values, inconsistencies, or issues?
4. Recommendations: What should be checked or analyzed next?

Format your response as JSON with keys: trends, outliers, data_quality, recommendations
Each should be an array of strings."""

    try:
        # Gemini's generate_content is synchronous, so we run it in executor
        import asyncio
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, model.generate_content, prompt)
        content = response.text
        
        # Try to parse as JSON
        try:
            # Clean up markdown code blocks if present
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            insights = json.loads(content)
        except json.JSONDecodeError:
            # If not valid JSON, structure it
            insights = {
                "trends": [content],
                "outliers": [],
                "data_quality": [],
                "recommendations": []
            }
        
        return insights
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")

async def check_gemini_connection():
    """Check if Gemini API is accessible"""
    try:
        if not os.getenv("GOOGLE_API_KEY"):
            return "unhealthy: API key not configured"
        
        # Simple test call
        import asyncio
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, model.generate_content, "test")
        return "healthy"
    except Exception as e:
        return f"unhealthy: {str(e)}"
