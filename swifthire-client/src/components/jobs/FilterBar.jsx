import React, { useState } from 'react'
import Icon from '../common/Icon.jsx'

const SORT_OPTIONS = ['Best Match', 'Most Recent', 'Salary: High to Low', 'Salary: Low to High']

export default function FilterBar({ filters = [], onRemoveFilter, onOpenDrawer, sortBy = 'Best Match', onSortChange }) {
  const [sortOpen, setSortOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 20px',
        background: '#ffffff',
        borderBottom: '1px solid #f3f4f6',
        overflowX: 'auto',
      }}
    >
      {/* All Filters button */}
      <button
        onClick={onOpenDrawer}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 12px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          fontSize: '12.5px',
          fontWeight: 600,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Icon name="filter" size={12} color="#fff" />
        All Filters
      </button>

      {/* Filter chips */}
      {filters.map((chip, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            background: '#f0f7ff',
            border: '1px solid #bfdbfe',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#1e40af',
            fontWeight: 500,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <span>{chip.label}</span>
          {chip.count != null && (
            <span
              style={{
                background: '#2563eb',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '10px',
                padding: '0 5px',
              }}
            >
              {chip.count}
            </span>
          )}
          <button
            onClick={() => onRemoveFilter && onRemoveFilter(i)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon name="x" size={12} />
          </button>
        </div>
      ))}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Sort dropdown */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setSortOpen((o) => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          {sortBy}
          <Icon name="chevron-down" size={13} />
        </button>
        {sortOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '4px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 50,
              minWidth: '180px',
              overflow: 'hidden',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { onSortChange && onSortChange(opt); setSortOpen(false) }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 14px',
                  background: opt === sortBy ? '#eff6ff' : 'none',
                  border: 'none',
                  fontSize: '13px',
                  color: opt === sortBy ? '#2563eb' : '#374151',
                  fontWeight: opt === sortBy ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
