import React, { useState, useEffect } from 'react'
import TopBar from '../components/layout/TopBar.jsx'
import JobCard from '../components/jobs/JobCard.jsx'
import LeBresumonPanel from '../components/orion/OrionPanel.jsx'
import { usePipeline } from '../hooks/usePipeline.js'

const SUB_TABS = ['Applied', 'Interviewing', 'Offer Received', 'Rejected', 'Archived']

export default function Applied() {
  const { savedJobs, fetchPipeline } = usePipeline()
  const [selectedJob, setSelectedJob] = useState(null)
  const [subTab, setSubTab] = useState('Applied')

  useEffect(() => {
    fetchPipeline()
  }, [])

  const jobs = savedJobs.length > 0
    ? savedJobs.map((sj) => ({ ...sj.job, status: sj.status, dateApplied: sj.dateApplied }))
    : []

  const filteredJobs = jobs.filter((j) => j.status === subTab)

  useEffect(() => {
    if (filteredJobs.length > 0 && !selectedJob) {
      setSelectedJob(filteredJobs[0])
    }
  }, [filteredJobs])

  function countByStatus(status) {
    return jobs.filter((j) => j.status === status).length
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        activeTab="Applied"
        onTabChange={() => {}}
        appliedCount={countByStatus('Applied')}
      />

      {/* Sub-tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          height: '44px',
          background: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 20px',
          gap: '4px',
        }}
      >
        {SUB_TABS.map((tab) => {
          const count = countByStatus(tab)
          const isActive = subTab === tab
          return (
            <button
              key={tab}
              onClick={() => { setSubTab(tab); setSelectedJob(null) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0 12px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563eb' : '#6b7280',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
              {count > 0 && (
                <span
                  style={{
                    background: isActive ? '#eff6ff' : '#f3f4f6',
                    color: isActive ? '#2563eb' : '#6b7280',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '10px',
                    padding: '1px 6px',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

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
          {filteredJobs.length === 0 && (
            <div style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', paddingTop: '60px' }}>
              No jobs in {subTab}.
            </div>
          )}
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              selected={selectedJob?.id === job.id}
              onClick={() => setSelectedJob(job)}
              mode="applied"
            />
          ))}
        </div>

        {/* OrionPanel */}
        <LeBresumonPanel selectedJob={selectedJob} />
      </div>
    </div>
  )
}