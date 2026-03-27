import React from 'react'
import { NavLink } from 'react-router-dom'
import Icon from '../common/Icon.jsx'

const navItems = [
  { to: '/jobs', icon: 'briefcase', label: 'Jobs' },
  { to: '/resume', icon: 'file-text', label: 'Resume', badge: { type: 'dot', color: '#16a34a' } },
  { to: '/profile', icon: 'user', label: 'Profile' },
  { to: '/agent', icon: 'cpu', label: 'Agent', badge: { type: 'text', label: 'BETA', bg: '#dbeafe', color: '#1d4ed8' } },
  { to: '/coaching', icon: 'book-open', label: 'Coaching', badge: { type: 'text', label: 'NEW', bg: '#fef3c7', color: '#92400e' } },
]

const bottomLinks = [
  { to: '/messages', icon: 'message-circle', label: 'Messages' },
  { to: '/feedback', icon: 'trending-up', label: 'Feedback' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function LeftNav() {
  return (
    <nav
      style={{
        width: '200px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 12px', marginBottom: '4px' }}>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>Swift</span>
        <span style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>Hire</span>
      </div>

      {/* Main Nav */}
      <div style={{ flex: 1, padding: '4px 8px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              color: isActive ? '#2563eb' : '#374151',
              background: isActive ? '#eff6ff' : 'transparent',
              marginBottom: '2px',
              transition: 'background 0.15s',
            })}
          >
            <Icon name={item.icon} size={16} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge?.type === 'dot' && (
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: item.badge.color,
                  flexShrink: 0,
                }}
              />
            )}
            {item.badge?.type === 'text' && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: item.badge.bg,
                  color: item.badge.color,
                  letterSpacing: '0.04em',
                }}
              >
                {item.badge.label}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Autofill Promo Card */}
      <div style={{ padding: '8px' }}>
        <div
          style={{
            background: '#eff6ff',
            borderRadius: '10px',
            padding: '12px',
            border: '1px solid #bfdbfe',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Icon name="zap" size={13} color="#2563eb" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1d4ed8' }}>Smart Autofill</span>
          </div>
          <p style={{ fontSize: '11px', color: '#3b82f6', margin: '0 0 8px', lineHeight: 1.4 }}>
            Apply to jobs 10x faster with AI-powered form filling.
          </p>
          <button
            style={{
              width: '100%',
              padding: '5px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Set Up Autofill
          </button>
        </div>
      </div>

      {/* Bottom Links */}
      <div style={{ padding: '8px', borderTop: '1px solid #f3f4f6' }}>
        {bottomLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 10px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive ? '#2563eb' : '#6b7280',
              background: isActive ? '#eff6ff' : 'transparent',
              marginBottom: '2px',
            })}
          >
            <Icon name={item.icon} size={15} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
