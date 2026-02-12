import { useState, useEffect } from 'react'
import { getStatus } from '../api'

export default function Status() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStatus()
    const interval = setInterval(loadStatus, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const loadStatus = async () => {
    try {
      const data = await getStatus()
      setStatus(data)
      setError(null)
    } catch (err: any) {
      setError('Unable to connect to backend')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'bg-green-500'
    if (status?.includes('unhealthy')) return 'bg-red-500'
    return 'bg-yellow-500'
  }

  const getStatusText = (status: string) => {
    if (status === 'healthy') return 'Healthy'
    if (status?.includes('unhealthy')) return 'Unhealthy'
    return 'Unknown'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Checking system status...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
        <p className="text-gray-600">Monitor the health of backend services</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {status && (
        <div className="space-y-4">
          {/* Backend Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Backend API</h3>
                <p className="text-sm text-gray-500">FastAPI server</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(status.backend)}`}>
                  {getStatusText(status.backend)}
                </span>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.backend)}`}></div>
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Database</h3>
                <p className="text-sm text-gray-500">SQLite connection</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(status.database)}`}>
                  {getStatusText(status.database)}
                </span>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.database)}`}></div>
              </div>
            </div>
            {status.database?.includes('unhealthy') && (
              <p className="mt-2 text-sm text-red-600">{status.database}</p>
            )}
          </div>

          {/* LLM Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">LLM Connection</h3>
                <p className="text-sm text-gray-500">OpenAI API</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(status.llm)}`}>
                  {getStatusText(status.llm)}
                </span>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.llm)}`}></div>
              </div>
            </div>
            {status.llm?.includes('unhealthy') && (
              <p className="mt-2 text-sm text-red-600">{status.llm}</p>
            )}
          </div>

          {/* Timestamp */}
          <div className="text-center text-sm text-gray-500">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={loadStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh Status
        </button>
      </div>
    </div>
  )
}
