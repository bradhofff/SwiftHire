import React from 'react'

const statusStyles = {
  Applied: { background: '#dbeafe', color: '#1d4ed8' },
  Interviewing: { background: '#ede9fe', color: '#6d28d9' },
  'Offer Received': { background: '#dcfce7', color: '#15803d' },
  Rejected: { background: '#fee2e2', color: '#dc2626' },
  Saved: { background: '#f3f4f6', color: '#4b5563' },
  Liked: { background: '#fce7f3', color: '#be185d' },
}

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || { background: '#f3f4f6', color: '#4b5563' }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        background: style.background,
        color: style.color,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}
