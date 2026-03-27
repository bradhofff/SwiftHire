import { useState, useEffect } from 'react'
import { mockJobs } from '../data/mockJobs.js'
import { getJobs } from '../services/api.js'

const defaultFilters = {
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
  const [jobs, setJobs] = useState(mockJobs)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)

  async function fetchJobs(currentFilters) {
    setLoading(true)
    setError(null)
    try {
      const data = await getJobs(currentFilters)
      // API returns paged result with Items array
      setJobs(data.items ?? data ?? mockJobs)
    } catch (err) {
      console.warn('API unavailable, using mock data:', err.message)
      setJobs(mockJobs)
      setError(null) // suppress error — fallback gracefully
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(filters)
  }, [])

  return { jobs, loading, error, filters, setFilters, fetchJobs }
}
