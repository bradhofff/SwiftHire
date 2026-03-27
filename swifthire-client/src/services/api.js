import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const getJobs = (filters) =>
  api.post('/jobs/search', filters).then((r) => r.data)

export const getJobById = (id) =>
  api.get(`/jobs/${id}`).then((r) => r.data)

export const saveJob = (jobId) =>
  api.post(`/jobs/${jobId}/save`).then((r) => r.data)

export const likeJob = (jobId) =>
  api.post(`/jobs/${jobId}/like`).then((r) => r.data)

export const getSavedJobs = (status) =>
  api.get('/pipeline', { params: { status } }).then((r) => r.data)

export const updateJobStatus = (id, status) =>
  api.patch(`/pipeline/${id}`, { status }).then((r) => r.data)

export const getProfile = () =>
  api.get('/profile').then((r) => r.data)

export const saveProfile = (profile) =>
  api.put('/profile', profile).then((r) => r.data)

export default api
