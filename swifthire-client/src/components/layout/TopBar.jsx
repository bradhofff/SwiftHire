import React from 'react'
import Icon from '../common/Icon.jsx'

export default function TopBar({ activeTab, onTabChange, likedCount = 0, appliedCount = 0, externalCount = 0 }) {
  const tabs = [
    { key: 'Recommended', label: 'Recommended' },
    { key: 'Liked', label: 'Liked', count: likedCount },
    { key: 'Applied', label: 'Applied', count: appliedCount },
    { key: 'External', label: 'External', count: externalCount },
  ]

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
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#9ca3af',
          letterSpacing: '0.08em',
          marginRight: '12px',
          whiteSpace: 'nowrap',
        }}
      >
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
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0 14px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563eb' : '#6b7280',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  style={{
                    background: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '10px',
                    padding: '1px 6px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right side: search + upgrade */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '5px 10px',
          }}
        >
          <Icon name="search" size={14} color="#9ca3af" />
          <input
            placeholder="Search jobs..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              color: '#374151',
              width: '160px',
              fontFamily: 'inherit',
            }}
          />
        </div>
        <button
          style={{
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
          }}
        >
          Upgrade to Turbo
        </button>
      </div>
    </div>
  )
}
