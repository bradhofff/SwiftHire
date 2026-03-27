import React from 'react'
import Icon from '../common/Icon.jsx'

function getScoreColor(score) {
  if (score >= 90) return '#00c853'
  if (score >= 75) return '#f59e0b'
  return '#ef4444'
}

export default function MatchScoreCard({ job }) {
  if (!job) return null

  const score = job.matchScore ?? 0
  const color = getScoreColor(score)
  const tierColor = getScoreColor(score)

  // SVG ring
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div
      style={{
        width: '140px',
        flexShrink: 0,
        background: 'linear-gradient(160deg, #0a1628 0%, #0d2137 100%)',
        borderRadius: '12px',
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* Ring */}
      <div style={{ position: 'relative', width: '72px', height: '72px' }}>
        <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        {/* Score text centered */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 500 }}>%</span>
        </div>
      </div>

      {/* Tier label */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          color: tierColor,
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}
      >
        {job.matchTier}
      </div>

      {/* Bullets */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {(job.matchBullets || []).map((bullet, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
            <span style={{ marginTop: '1px', flexShrink: 0 }}>
              <Icon name="check" size={11} color={color} strokeWidth={3} />
            </span>
            <span style={{ fontSize: '10.5px', color: '#cbd5e1', lineHeight: 1.35 }}>{bullet}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
