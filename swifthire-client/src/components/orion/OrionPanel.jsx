import React, { useState } from 'react'
import Icon from '../common/Icon.jsx'

export default function LeBresumonPanel({ selectedJob }) {
  const [message, setMessage] = useState('')

  const analysis = selectedJob
    ? `Your background in ${selectedJob.level.toLowerCase()} engineering aligns well with ${selectedJob.company}'s ${selectedJob.title} role. The ${selectedJob.workModel} setup and ${selectedJob.jobType} structure match your stated preferences.`
    : null

  return (
    <div
      style={{
        width: '280px',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #0a1628 0%, #0d2137 60%, #0f2744 100%)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 'calc(100vh - 52px)',
        position: 'sticky',
        top: '52px',
        borderLeft: '1px solid #1e3a5f',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Icon name="cpu" size={16} color="#60a5fa" />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>LeBresumon</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Your AI Copilot</div>
          </div>
          <button
            style={{
              padding: '5px 10px',
              background: '#1e3a5f',
              border: '1px solid #2d5080',
              borderRadius: '7px',
              color: '#93c5fd',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Quick Guide
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {selectedJob ? (
          <>
            {/* Job title context */}
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                {selectedJob.title}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>@ {selectedJob.company}</div>
            </div>

            {/* AI Analysis */}
            <div
              style={{
                background: '#0f2744',
                border: '1px solid #1e3a5f',
                borderRadius: '10px',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Icon name="zap" size={13} color="#f59e0b" />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#f59e0b' }}>AI Analysis</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                {analysis}
              </p>
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {['Tailor my resume for this role', 'Draft a cover letter', 'Estimate interview difficulty'].map((action) => (
                <button
                  key={action}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    background: '#0f2744',
                    border: '1px solid #1e3a5f',
                    borderRadius: '8px',
                    color: '#93c5fd',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Icon name="arrow-right" size={12} color="#3b82f6" />
                  {action}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px', textAlign: 'center', paddingTop: '40px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0f2744', border: '2px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="cpu" size={22} color="#60a5fa" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>Hi, I'm LeBresumon</div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                Select a job to get AI insights and application assistance.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ask input — always visible */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e3a5f' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#0f2744',
            border: '1px solid #1e3a5f',
            borderRadius: '10px',
            padding: '8px 12px',
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask LeBresumon anything..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#cbd5e1',
              fontSize: '12.5px',
              fontFamily: 'inherit',
            }}
          />
          <button
            style={{
              background: message.trim() ? '#2563eb' : '#1e3a5f',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 7px',
              cursor: message.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s',
            }}
          >
            <Icon name="arrow-right" size={14} color={message.trim() ? '#fff' : '#334155'} />
          </button>
        </div>
      </div>
    </div>
  )
}
