import { useState, useEffect } from 'react'
import { getReports, getReport, deleteReport } from '../api'
import InsightsPanel from '../components/InsightsPanel.tsx'

export default function Reports() {
  const [reports, setReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      const data = await getReports()
      setReports(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error loading reports')
    } finally {
      setLoading(false)
    }
  }

  const handleViewReport = async (reportId: number) => {
    try {
      const data = await getReport(reportId)
      setSelectedReport(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error loading report details')
    }
  }

  const handleDeleteReport = async (reportId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    
    if (!confirm('Are you sure you want to delete this report?')) {
      return
    }

    try {
      await deleteReport(reportId)
      setReports(reports.filter(r => r.id !== reportId))
      if (selectedReport?.id === reportId) {
        setSelectedReport(null)
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error deleting report')
    }
  }

  const handleExport = (format: 'text' | 'markdown') => {
    if (!selectedReport) return
    
    let content = ''
    
    if (format === 'markdown') {
      content = `# CSV Insights Report\n\n`
      content += `**File**: ${selectedReport.filename}\n`
      content += `**Rows**: ${selectedReport.rows}\n`
      content += `**Columns**: ${selectedReport.columns}\n`
      content += `**Date**: ${new Date(selectedReport.created_at).toLocaleString()}\n\n`
      
      if (selectedReport.insights.trends?.length) {
        content += `## Key Trends\n${selectedReport.insights.trends.map((t: string) => `- ${t}`).join('\n')}\n\n`
      }
      if (selectedReport.insights.outliers?.length) {
        content += `## Outliers\n${selectedReport.insights.outliers.map((o: string) => `- ${o}`).join('\n')}\n\n`
      }
      if (selectedReport.insights.data_quality?.length) {
        content += `## Data Quality\n${selectedReport.insights.data_quality.map((d: string) => `- ${d}`).join('\n')}\n\n`
      }
      if (selectedReport.insights.recommendations?.length) {
        content += `## Recommendations\n${selectedReport.insights.recommendations.map((r: string) => `- ${r}`).join('\n')}\n`
      }
    } else {
      content = `CSV Insights Report\n\n`
      content += `File: ${selectedReport.filename}\n`
      content += `Rows: ${selectedReport.rows}\n`
      content += `Columns: ${selectedReport.columns}\n`
      content += `Date: ${new Date(selectedReport.created_at).toLocaleString()}\n\n`
      content += JSON.stringify(selectedReport.insights, null, 2)
    }
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `insights-${selectedReport.filename}.${format === 'markdown' ? 'md' : 'txt'}`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading reports...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recent Reports</h1>
        <p className="text-gray-600">View your last 5 generated reports</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No reports yet. Upload a CSV to get started!</p>
        </div>
      ) : (
        <>
          {!selectedReport ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => handleViewReport(report.id)}
                  className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{report.filename}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-600">
                        <p>{report.rows} rows</p>
                        <p>{report.columns} columns</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteReport(report.id, e)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {report.insights && (
                    <div className="space-y-3">
                      {report.insights.trends?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Key Trends</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {report.insights.trends.slice(0, 2).map((trend: string, i: number) => (
                              <li key={i}>{trend}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {report.insights.recommendations?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Recommendations</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {report.insights.recommendations.slice(0, 2).map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedReport.filename}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedReport.rows} rows × {selectedReport.columns} columns
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedReport.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    ← Back to Reports
                  </button>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Columns</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.column_names.map((col: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Insights</h2>
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
                <InsightsPanel insights={selectedReport.insights} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
