import { useState } from 'react'
import { getSavedJobs, updateJobStatus } from '../services/api.js'

export function usePipeline() {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchPipeline(status) {
    setLoading(true)
    try {
      const data = await getSavedJobs(status)
      setSavedJobs(data ?? [])
    } catch (err) {
      console.warn('Pipeline API unavailable:', err.message)
      setSavedJobs([])
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id, status) {
    try {
      await updateJobStatus(id, status)
      await fetchPipeline()
    } catch (err) {
      console.warn('Failed to update status:', err.message)
    }
  }

  return { savedJobs, loading, fetchPipeline, updateStatus }
}
