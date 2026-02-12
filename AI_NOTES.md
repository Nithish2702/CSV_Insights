# AI Usage Notes

## What I Used AI For

### Code Generation
- Initial project scaffolding and structure
- Boilerplate code for React components and FastAPI routes
- TypeScript interfaces and type definitions
- Tailwind CSS styling suggestions

### Problem Solving
- CSV parsing edge cases (different delimiters, encodings)
- FastAPI async patterns and best practices
- React state management for file uploads
- Chart.js/Recharts configuration

### Documentation
- README structure and content
- API endpoint documentation
- Code comments for complex logic

## What I Checked Myself

### Security
- Verified no API keys in code
- Checked file upload size limits
- Validated input sanitization
- Reviewed CORS configuration

### Functionality
- Tested CSV parsing with various formats
- Verified insights generation quality
- Tested report saving and retrieval
- Checked export functionality
- Validated status page health checks

### Code Quality
- Reviewed generated code for best practices
- Refactored repetitive patterns
- Added proper error handling
- Ensured type safety in TypeScript

### Testing
- Manual testing of all user flows
- Edge case testing (empty files, malformed CSV)
- API endpoint testing
- Cross-browser compatibility

## LLM Provider Choice

**Provider**: Google Gemini
**Model**: gemini-1.5-flash

**Why Google Gemini:**
1. **Free Tier**: Generous free quota for development and demo
2. **Quality**: Excellent at structured data analysis and generating insights
3. **Speed**: Very fast response times
4. **Cost**: Free tier is sufficient for this use case
5. **Reliability**: Stable API with good uptime
6. **Documentation**: Good docs and examples

**Alternatives Considered:**
- OpenAI GPT-4: Better quality but requires payment
- OpenAI GPT-3.5: Cheaper but less accurate for complex data insights
- Anthropic Claude: Great for analysis but requires API access
- Open-source models: Would require self-hosting

## Database Choice

**Provider**: Supabase (PostgreSQL)

**Why Supabase:**
1. **Production-Ready**: PostgreSQL is industry standard
2. **Free Tier**: Generous limits for development and demo
3. **Scalability**: Easy to scale as usage grows
4. **Features**: Built-in auth, real-time, storage for future
5. **Backups**: Automatic daily backups included
6. **No Setup**: Managed service, no server maintenance

**Alternatives Considered:**
- SQLite: Good for local dev but not production-scale
- Self-hosted PostgreSQL: More work to maintain
- MongoDB: Not ideal for structured report data

## AI Limitations Encountered

1. **Hallucinations**: AI sometimes suggests trends that don't exist in small datasets
   - Solution: Added data validation and confidence indicators
   
2. **Context Limits**: Large CSVs exceed token limits
   - Solution: Sample data or summarize before sending to LLM

3. **Inconsistent Format**: AI responses varied in structure
   - Solution: Used structured prompts with JSON format requests

4. **JSON Parsing**: Gemini sometimes wraps JSON in markdown code blocks
   - Solution: Added code to strip markdown formatting before parsing

## Prompt Engineering Approach

- Used few-shot examples for consistent output format
- Included data statistics in prompts for grounding
- Asked for specific sections (trends, outliers, recommendations)
- Requested confidence levels for insights
