import React, { useState } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import FilterBar from '../components/jobs/FilterBar.jsx'
import JobCard from '../components/jobs/JobCard.jsx'
import LeBresumonPanel from '../components/lebresumon/LeBresumonPanel.jsx'
import { useJobs } from '../hooks/useJobs.js'
import { useFilters } from '../hooks/useFilters.js'

export default function JobBoard() {
  const { jobs, loading, filters, setFilters, fetchJobs } = useJobs()
  const { activeChips, removeChip } = useFilters()
  const [selectedJob, setSelectedJob] = useState(null)
  const [activeTab, setActiveTab] = useState('Recommended')
  const [sortBy, setSortBy] = useState('Best Match')
  const [searchSummary, setSearchSummary] = useState(null) // { title, location }

  // Select first job once jobs load
  React.useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
    }
  }, [jobs])

  // Search handler called by TopBar
  function handleSearch(title, location) {
    const updated = { ...filters, title, location, page: 1 }
    setFilters(updated)
    fetchJobs(updated)
    setSearchSummary(title && location ? { title, location } : null)
    setSelectedJob(null)
  }

  // Filter jobs by tab
  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'Recommended') return job.status === null || job.status === undefined
    if (activeTab === 'Liked')    return job.status === 'Liked'
    if (activeTab === 'Applied')  return job.status === 'Applied'
    if (activeTab === 'External') return job.status === 'External'
    return true
  })

  const likedCount    = jobs.filter((j) => j.status === 'Liked').length
  const appliedCount  = jobs.filter((j) => j.status === 'Applied').length
  const externalCount = jobs.filter((j) => j.status === 'External').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        likedCount={likedCount}
        appliedCount={appliedCount}
        externalCount={externalCount}
        onSearch={handleSearch}
        loading={loading}
      />
      <FilterBar
        filters={activeChips}
        onRemoveFilter={removeChip}
        onOpenDrawer={() => {}}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Job list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Search summary tagline */}
          {searchSummary && (
            <div style={{ fontSize: '12.5px', color: '#6b7280', paddingBottom: '2px' }}>
              Showing results for:{' '}
              <strong style={{ color: '#111827' }}>{searchSummary.title}</strong>
              {' '}in{' '}
              <strong style={{ color: '#111827' }}>{searchSummary.location}</strong>
              <button
                onClick={() => { setSearchSummary(null); fetchJobs({ ...filters, title: '', location: '' }) }}
                style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '12px' }}
              >
                ✕ Clear
              </button>
            </div>
          )}

          {loading && (
            <div style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', paddingTop: '40px' }}>
              Loading jobs...
            </div>
          )}
          {!loading && filteredJobs.length === 0 && (
            <div style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', paddingTop: '40px' }}>
              No jobs found in this tab.
            </div>
          )}
          {filteredJobs.map((job) => (
            <JobCard
              key={job.externalId ?? job.id}
              job={job}
              selected={selectedJob?.externalId === job.externalId}
              onClick={() => setSelectedJob(job)}
              mode="recommended"
            />
          ))}
        </div>

        {/* LeBresumon Panel */}
        <LeBresumonPanel selectedJob={selectedJob} />
      </div>
    </div>
  )
}
