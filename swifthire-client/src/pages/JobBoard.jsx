import React, { useState } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import FilterBar from '../components/jobs/FilterBar.jsx'
import JobCard from '../components/jobs/JobCard.jsx'
import LeBresumonPanel from '../components/orion/OrionPanel.jsx'
import { useJobs } from '../hooks/useJobs.js'
import { useFilters } from '../hooks/useFilters.js'

export default function JobBoard() {
  const { jobs, loading } = useJobs()
  const { activeChips, removeChip } = useFilters()
  const [selectedJob, setSelectedJob] = useState(null)
  const [activeTab, setActiveTab] = useState('Recommended')
  const [sortBy, setSortBy] = useState('Best Match')

  // Initialize selectedJob to first job once loaded
  React.useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0])
    }
  }, [jobs])

  // Filter jobs by tab
  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'Recommended') return job.status === null || job.status === undefined
    if (activeTab === 'Liked') return job.status === 'Liked'
    if (activeTab === 'Applied') return job.status === 'Applied'
    if (activeTab === 'External') return job.status === 'External'
    return true
  })

  const likedCount = jobs.filter((j) => j.status === 'Liked').length
  const appliedCount = jobs.filter((j) => j.status === 'Applied').length
  const externalCount = jobs.filter((j) => j.status === 'External').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        likedCount={likedCount}
        appliedCount={appliedCount}
        externalCount={externalCount}
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
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
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
              key={job.id}
              job={job}
              selected={selectedJob?.id === job.id}
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
