import { useState } from 'react'
import { uploadCSV, generateInsights } from '../api'
import DataTable from '../components/DataTable'
import InsightsPanel from '../components/InsightsPanel.tsx'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any>(null)
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setCsvData(null)
      setInsights(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await uploadCSV(file)
      setCsvData(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error uploading file')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateInsights = async () => {
    if (!csvData) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await generateInsights(csvData)
      setInsights(result.insights)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error generating insights')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: 'text' | 'markdown') => {
    if (!insights || !csvData) return
    
    let content = ''
    
    if (format === 'markdown') {
      content = `# CSV Insights Report\n\n`
      content += `**File**: ${csvData.filename}\n`
      content += `**Rows**: ${csvData.rows}\n`
      content += `**Columns**: ${csvData.columns}\n\n`
      
      if (insights.trends?.length) {
        content += `## Key Trends\n${insights.trends.map((t: string) => `- ${t}`).join('\n')}\n\n`
      }
      if (insights.outliers?.length) {
        content += `## Outliers\n${insights.outliers.map((o: string) => `- ${o}`).join('\n')}\n\n`
      }
      if (insights.data_quality?.length) {
        content += `## Data Quality\n${insights.data_quality.map((d: string) => `- ${d}`).join('\n')}\n\n`
      }
      if (insights.recommendations?.length) {
        content += `## Recommendations\n${insights.recommendations.map((r: string) => `- ${r}`).join('\n')}\n`
      }
    } else {
      content = `CSV Insights Report\n\n`
      content += `File: ${csvData.filename}\n`
      content += `Rows: ${csvData.rows}\n`
      content += `Columns: ${csvData.columns}\n\n`
      content += JSON.stringify(insights, null, 2)
    }
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `insights-${csvData.filename}.${format === 'markdown' ? 'md' : 'txt'}`
    a.click()
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CSV Insights Dashboard</h1>
        <p className="text-gray-600">Upload a CSV file to generate AI-powered insights</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Step 1: Upload CSV File</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Preview Section */}
      {csvData && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Step 2: Preview Data</h2>
              <p className="text-sm text-gray-600">
                {csvData.rows} rows × {csvData.columns} columns
              </p>
            </div>
            <button
              onClick={handleGenerateInsights}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
            >
              {loading ? 'Generating...' : 'Generate Insights'}
            </button>
          </div>
          <DataTable data={csvData.preview} columns={csvData.column_names} />
        </div>
      )}

      {/* Insights Section */}
      {insights && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Step 3: Review Insights</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('text')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Export as Text
              </button>
              <button
                onClick={() => handleExport('markdown')}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Export as Markdown
              </button>
            </div>
          </div>
          <InsightsPanel insights={insights} />
        </div>
      )}
    </div>
  )
}
