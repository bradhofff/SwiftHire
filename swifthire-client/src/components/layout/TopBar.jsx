import React, { useState } from 'react'
import Icon from '../common/Icon.jsx'

// ── Location-pattern detection ──────────────────────────────────────────────
const US_STATES = new Set([
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
])

function parseSearchInput(raw) {
  const s = raw.trim()
  if (!s) return { title: '', location: '' }

  // "X in Y" — split on first " in "
  const inIdx = s.toLowerCase().indexOf(' in ')
  if (inIdx !== -1) {
    return {
      title: s.slice(0, inIdx).trim(),
      location: s.slice(inIdx + 4).trim(),
    }
  }

  // Looks like a location: has comma, ends in state abbr, or is a location keyword
  const locationKeywords = ['remote', 'anywhere', 'hybrid', 'worldwide']
  const lastWord = s.split(/\s+/).pop().toUpperCase().replace(/[^A-Z]/g, '')
  if (
    s.includes(',') ||
    US_STATES.has(lastWord) ||
    locationKeywords.includes(s.toLowerCase())
  ) {
    return { title: '', location: s }
  }

  return { title: s, location: '' }
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'spin 0.7s linear infinite' }}>
      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeDasharray="18 10" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </svg>
  )
}

export default function TopBar({
  activeTab,
  onTabChange,
  likedCount = 0,
  appliedCount = 0,
  externalCount = 0,
  onSearch,
  loading = false,
}) {
  const [searchValue, setSearchValue] = useState('')

  const tabs = [
    { key: 'Recommended', label: 'Recommended' },
    { key: 'Liked',       label: 'Liked',    count: likedCount },
    { key: 'Applied',     label: 'Applied',  count: appliedCount },
    { key: 'External',    label: 'External', count: externalCount },
  ]

  function handleSearch() {
    if (!onSearch) return
    const parsed = parseSearchInput(searchValue)
    onSearch(parsed.title, parsed.location)
  }

  return (
    <div
      style={{
        height: '52px',
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        paddingRight: '16px',
        gap: '4px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* JOBS label */}
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', marginRight: '12px', whiteSpace: 'nowrap' }}>
        JOBS
      </span>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'stretch', height: '52px', flex: 1, gap: '2px' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '0 14px', background: 'none', border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer', fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563eb' : '#6b7280',
                whiteSpace: 'nowrap', transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '11px', fontWeight: 700, borderRadius: '10px', padding: '1px 6px', minWidth: '20px', textAlign: 'center' }}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

        {/* Unified search bar */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', width: '300px' }}>
          <span style={{ paddingLeft: '10px', paddingRight: '4px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Icon name="search" size={14} color="#9ca3af" />
          </span>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search jobs, titles, or locations..."
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontSize: '13px', color: '#374151', padding: '7px 6px', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              padding: '0 12px', height: '34px',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px', fontWeight: 600, transition: 'background 0.15s',
              flexShrink: 0,
            }}
          >
            {loading ? <Spinner /> : 'Search'}
          </button>
        </div>

        {/* Upgrade button */}
        <button
          style={{
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
            whiteSpace: 'nowrap', letterSpacing: '0.01em',
          }}
        >
          Upgrade to Turbo
        </button>
      </div>
    </div>
  )
}
