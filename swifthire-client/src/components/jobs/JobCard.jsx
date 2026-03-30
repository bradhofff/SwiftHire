import React, { useState } from 'react'
import Icon from '../common/Icon.jsx'
import MatchScoreCard from './MatchScoreCard.jsx'

function formatSalary(job) {
  if (job.salaryMin == null && job.salaryMax == null) return null
  const fmt = (n) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
  if (job.salaryMin && job.salaryMax) {
    return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)} / ${job.salaryType}`
  }
  if (job.salaryMin) return `${fmt(job.salaryMin)}+ / ${job.salaryType}`
  if (job.salaryMax) return `Up to ${fmt(job.salaryMax)} / ${job.salaryType}`
  return null
}

export default function JobCard({ job, selected, onClick, mode = 'recommended' }) {
  const [liked, setLiked] = useState(false)
  const [hovered, setHovered] = useState(false)

  const salary = formatSalary(job)

  const borderColor = selected ? '#2563eb' : hovered ? '#93c5fd' : '#e5e7eb'
  const bgColor = selected ? '#f0f7ff' : '#ffffff'

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        userSelect: 'none',
        display: 'flex',
        gap: '12px',
        alignItems: 'stretch',
      }}
    >
      {/* ── Left: main card content ── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Top row: logo + meta + actions */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          {/* Logo */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: job.logoColor,
              color: job.logoText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              flexShrink: 0,
            }}
          >
            {job.logo}
          </div>

          {/* Title + company */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{job.posted}</span>
              {job.earlyApplicant && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Early Applicant
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#111827',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {job.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: 500 }}>{job.companyName}</span>
              {(job.tags || []).map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '11px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    padding: '1px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9ca3af', borderRadius: '6px' }}
              title="Hide"
            >
              <Icon name="bell" size={15} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: liked ? '#ef4444' : '#9ca3af',
                borderRadius: '6px',
              }}
              title="Like"
            >
              <Icon name="heart" size={15} color={liked ? '#ef4444' : '#9ca3af'} />
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9ca3af', borderRadius: '6px' }}
              title="More"
            >
              <Icon name="more-horizontal" size={15} />
            </button>
          </div>
        </div>

        {/* Middle: 3-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6px 8px',
            margin: '10px 0',
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="map-pin" size={12} />
              {job.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="monitor" size={12} />
              {job.workModel}
            </span>
          </div>
          {/* Center */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="briefcase" size={12} />
              {job.jobType}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="users" size={12} />
              {job.level}
            </span>
          </div>
          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {salary && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon name="dollar" size={12} />
                {salary}
              </span>
            )}
            {job.expRequired && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon name="clock" size={12} />
                {job.expRequired}
              </span>
            )}
          </div>
        </div>

        {/* Bottom row */}
        {mode === 'recommended' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
            <span style={{ fontSize: '11.5px', color: '#9ca3af', flex: 1 }}>
              <Icon name="users" size={12} /> {job.applicants}
            </span>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '5px 12px',
                background: 'none',
                border: '1.5px solid #2563eb',
                borderRadius: '7px',
                color: '#2563eb',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Ask LeBresumon
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '5px 14px',
                background: job.h1b ? '#16a34a' : '#2563eb',
                border: 'none',
                borderRadius: '7px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {job.h1b ? 'Apply with Autofill' : 'Apply Now'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
            <span style={{ fontSize: '11.5px', color: '#9ca3af', flex: 1 }}>
              Applied on {job.dateApplied || 'Mar 15, 2026'}
            </span>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '5px 12px',
                background: 'none',
                border: '1.5px solid #2563eb',
                borderRadius: '7px',
                color: '#2563eb',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Ask LeBresumon
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '5px 12px',
                background: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '7px',
                color: '#2563eb',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Applied <Icon name="chevron-down" size={12} />
            </button>
          </div>
        )}
      </div>

      {/* ── Right: Match Score Card ── */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <MatchScoreCard job={job} />
      </div>
    </div>
  )
}
