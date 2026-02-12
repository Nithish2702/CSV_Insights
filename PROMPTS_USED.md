# Prompts Used for Development

This document contains the actual prompts I used while building this project with AI assistance.

## Getting Started

**Me:** "I want to build a CSV insights dashboard. It should have a React frontend and FastAPI backend. Users upload CSV files, see a preview, and get AI-generated insights about their data. Can you help me set this up?"

**Me:** "What's the best way to structure this project? Should I use separate folders for frontend and backend?"

**Me:** "I need a list of npm packages for the React side. I want TypeScript, file uploads, data tables, and the ability to export reports."

**Me:** "For the backend, what Python packages do I need? I'm using FastAPI, need to process CSVs, connect to a database, and use an AI API."

## Backend Development

**Me:** "Create a FastAPI app with routes for uploading CSVs, generating insights, saving reports, and checking system status."

**Me:** "How do I parse CSV files safely in Python? I need to handle different encodings and detect if columns are numeric or text."

**Me:** "I want to use Google Gemini for generating insights. How do I set that up with FastAPI? Show me how to make async calls."

**Me:** "Create a prompt for Gemini that analyzes CSV data and returns insights about trends, outliers, data quality issues, and recommendations. Make it return JSON."

**Me:** "I'm getting an error about NaN values not being JSON serializable. How do I fix this when converting pandas DataFrames?"

**Me:** "Set up a SQLAlchemy model for storing reports with fields like filename, row count, column count, insights, and timestamp."

**Me:** "How do I connect to Supabase PostgreSQL from FastAPI? What should my DATABASE_URL look like?"

**Me:** "Add CORS to my FastAPI app so my React frontend can call it from localhost:3000."

## Frontend Development

**Me:** "Create a React component for uploading CSV files. It should only accept .csv files and show the filename after selection."

**Me:** "Build a data table component that displays CSV data with column headers. Make it responsive and clean looking."

**Me:** "I need a component to display the AI insights. It should have sections for trends, outliers, data quality, and recommendations with different colors."

**Me:** "Create a home page that has three steps: upload CSV, preview data, and generate insights. Add buttons for each step."

**Me:** "Add export functionality that lets users download insights as text or markdown files."

**Me:** "Build a reports page that shows the last 5 reports with their filename, date, and a preview of insights."

**Me:** "Create a status page that shows if the backend, database, and AI service are healthy."

**Me:** "Style everything with Tailwind CSS. Make it look modern and professional."

## Fixing Issues

**Me:** "I'm getting 'Cannot find module InsightsPanel' error in TypeScript. The file exists though."

**Me:** "The Gemini API is returning 404 saying 'gemini-pro not found'. What's the correct model name?"

**Me:** "How do I handle the case where Gemini returns JSON wrapped in markdown code blocks?"

**Me:** "The upload is failing with 'Out of range float values are not JSON compliant: nan'. How do I fix this?"

**Me:** "My Supabase connection is failing with 'could not translate host name'. What could be wrong?"

**Me:** "I switched from OpenAI to Gemini. What environment variable name does Gemini expect?"

**Me:** "The database health check is failing with 'Textual SQL expression should be explicitly declared as text'. How do I fix this?"

## UI/UX Improvements

**Me:** "Make the report cards clickable so clicking anywhere opens the full report with download options."

**Me:** "Add a delete button to each report card. It should ask for confirmation before deleting."

**Me:** "When I click on a report card, it should open the full report. Add a back button to return to the list."

**Me:** "Make the report cards have a hover effect so users know they're clickable."

## Documentation

**Me:** "Is README.md correct? I'm using Gemini now, not OpenAI."

**Me:** "Update AI_NOTES.md to reflect that I'm using Gemini and explain why I chose it."

**Me:** "Make PROMPTS_USED.md more natural, like actual conversations I had with you."

**Me:** "Remove unnecessary prompts from that."

---

## Notes

These are the actual prompts I used throughout development. The AI helped with:
- Initial setup and boilerplate code
- Fixing bugs and errors
- Suggesting best practices
- Writing documentation

**What I did myself:**
- Designed the overall architecture and feature set
- Made technology choices (Gemini, Supabase, React, FastAPI)
- Reviewed and tested all generated code
- Debugged issues and understood the solutions
- Made UI/UX decisions
- Integrated all components together
- Deployed and configured the application

I always reviewed and tested the generated code myself before using it.
