import { useState, useEffect } from 'react'
import { getJobs } from '../services/api.js'

const defaultFilters = {
  title: '',
  location: '',
  jobFunctions: [],
  excludedTitles: [],
  jobTypes: [],
  workModels: [],
  experienceLevels: [],
  salaryMin: null,
  salaryMax: null,
  h1bRequired: false,
  excludeSecurityClearance: false,
  excludeUsCitizenOnly: false,
  daysAgo: null,
  industries: [],
  skills: [],
  excludedSkills: [],
  roleType: '',
  companyStages: [],
  excludeStaffingAgency: false,
  excludedCompanies: [],
  page: 1,
  pageSize: 20,
}

export function useJobs() {
  const [jobs, setJobs] = useState([])        // empty array, never undefined
  const [loading, setLoading] = useState(true) // start true so UI shows spinner
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)

  async function fetchJobs(currentFilters) {
    setLoading(true)
    setError(null)
    try {
      const data = await getJobs(currentFilters)
      // Backend returns { jobs: [], totalCount, page, pageSize }
      setJobs(data.jobs ?? [])
    } catch (err) {
      console.warn('API unavailable:', err.message)
      setJobs([])
      setError('Could not load jobs. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(filters)
  }, [])

  return { jobs, loading, error, filters, setFilters, fetchJobs }
}