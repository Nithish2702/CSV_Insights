import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadCSV = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/api/csv/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const generateInsights = async (data: any) => {
  const response = await api.post('/api/csv/insights', data)
  return response.data
}

export const getReports = async () => {
  const response = await api.get('/api/reports/')
  return response.data
}

export const getReport = async (id: number) => {
  const response = await api.get(`/api/reports/${id}`)
  return response.data
}

export const deleteReport = async (id: number) => {
  const response = await api.delete(`/api/reports/${id}`)
  return response.data
}

export const getStatus = async () => {
  const response = await api.get('/api/status/')
  return response.data
}

export default api
