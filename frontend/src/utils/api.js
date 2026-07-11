import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const getSymptoms = () => axios.get(`${BASE}/symptoms`)
export const predict = (symptoms) => axios.post(`${BASE}/predict`, { symptoms })
export const getDiseaseInfo = (diseaseName) => axios.get(`${BASE}/disease-info/${encodeURIComponent(diseaseName)}`)
export const extractSymptomsFromText = (text) => axios.post(`${BASE}/extract-symptoms`, { text })
