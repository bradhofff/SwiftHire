import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { getResumes, uploadResume, updateResumeDetails } from '../services/api.js'

// ── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  '#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f59e0b',
  '#ef4444','#10b981','#f97316','#6366f1','#06b6d4',
]

function avatarColor(name = '') {
  const code = (name || 'R').charCodeAt(0)
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length]
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ProgressRing({ value, max }) {
  const r = 9
  const circ = 2 * Math.PI * r
  const filled = Math.min(value / max, 1) * circ
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" style={{ flexShrink: 0 }}>
      <circle cx="13" cy="13" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
      <circle cx="13" cy="13" r={r} fill="none" stroke="#22c55e" strokeWidth="3"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 13 13)"
      />
    </svg>
  )
}

// ── Upload Modal ──────────────────────────────────────────────────────────────

const MAX_FILE_BYTES = 10 * 1024 * 1024

function UploadModal({ onClose, onSuccess }) {
  const [stage, setStage]         = useState('idle')  // idle | uploading | success
  const [error, setError]         = useState(null)
  const [uploaded, setUploaded]   = useState(null)    // { resumeId, fileName }
  const [resumeName, setResumeName]   = useState('')
  const [targetTitle, setTargetTitle] = useState('')
  const [saving, setSaving]       = useState(false)
  const fileRef = useRef(null)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx).')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('File must be under 10 MB.')
      return
    }

    setError(null)
    setStage('uploading')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const result = await uploadResume(fd)
      setUploaded(result)
      setResumeName(file.name.replace(/\.[^/.]+$/, ''))
      setStage('success')
    } catch {
      setError('Upload failed — please try again.')
      setStage('idle')
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateResumeDetails(uploaded.resumeId, {
        resumeName: resumeName.trim() || uploaded.fileName,
        targetJobTitle: targetTitle.trim() || null,
      })
      onSuccess()
      onClose()
    } catch {
      setSaving(false)
    }
  }

  return ReactDOM.createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px',
        width: '100%', maxWidth: '440px', margin: '0 16px',
        padding: '36px 36px 32px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        position: 'relative',
      }}>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#9ca3af', padding: '4px', lineHeight: 1,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {stage !== 'success' ? (
          /* ── Screen 2: Upload ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0, textAlign: 'center' }}>
              Upload Resume to Get Started
            </h2>

            {/* Document-with-upload illustration */}
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none" style={{ margin: '4px 0' }}>
              <rect x="14" y="8" width="44" height="58" rx="5" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
              <path d="M42 8v14h16" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="24" y1="30" x2="50" y2="30" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="24" y1="38" x2="50" y2="38" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="24" y1="46" x2="38" y2="46" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="66" cy="66" r="18" fill="#2563eb"/>
              <line x1="66" y1="56" x2="66" y2="70" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <polyline points="60,63 66,56 72,63" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <line x1="59" y1="74" x2="73" y2="74" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>

            <p style={{ fontSize: '13.5px', color: '#6b7280', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
              Files should be in <strong>PDF or Word</strong> format and must not exceed <strong>10 MB</strong>.
            </p>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
                padding: '10px 14px', fontSize: '13px', color: '#dc2626',
                width: '100%', textAlign: 'center', boxSizing: 'border-box',
              }}>
                {error}
              </div>
            )}

            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />

            <button
              onClick={() => fileRef.current?.click()}
              disabled={stage === 'uploading'}
              style={{
                width: '100%', padding: '13px',
                background: '#111827',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 600,
                cursor: stage === 'uploading' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: stage === 'uploading' ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {stage === 'uploading' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.7s linear infinite' }}>
                    <circle cx="8" cy="8" r="5.5" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="20 10" strokeLinecap="round"/>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </svg>
                  Uploading...
                </>
              ) : 'Upload'}
            </button>
          </div>
        ) : (
          /* ── Screen 3: Success ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

            {/* Robot smiley face */}
            <svg width="76" height="76" viewBox="0 0 76 76" fill="none" style={{ margin: '4px 0 0' }}>
              <rect x="10" y="16" width="56" height="46" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
              <circle cx="27" cy="34" r="5.5" fill="#2563eb"/>
              <circle cx="49" cy="34" r="5.5" fill="#2563eb"/>
              <circle cx="28.5" cy="32.5" r="2" fill="#fff"/>
              <circle cx="50.5" cy="32.5" r="2" fill="#fff"/>
              <path d="M27 48 Q38 57 49 48" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* antenna */}
              <rect x="32" y="6" width="12" height="12" rx="3" fill="#dbeafe"/>
              <line x1="38" y1="6" x2="38" y2="3" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="38" cy="2" r="2" fill="#3b82f6"/>
              {/* arms */}
              <rect x="1" y="30" width="9" height="14" rx="4.5" fill="#dbeafe"/>
              <rect x="66" y="30" width="9" height="14" rx="4.5" fill="#dbeafe"/>
              {/* check badge */}
              <circle cx="60" cy="62" r="11" fill="#22c55e"/>
              <path d="M55 62l3.5 3.5 6-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Upload Success!</h2>
              <p style={{ fontSize: '13.5px', color: '#6b7280', margin: 0 }}>
                Let's confirm a few details for future reference.
              </p>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Resume Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1.5px solid #e5e7eb', borderRadius: '8px',
                    fontSize: '14px', color: '#111827', outline: 'none',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Target Job Title
                </label>
                <input
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  placeholder="Enter the job title you're aiming for (e.g., Product Manager)"
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1.5px solid #e5e7eb', borderRadius: '8px',
                    fontSize: '14px', color: '#111827', outline: 'none',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !resumeName.trim()}
              style={{
                width: '100%', padding: '13px',
                background: saving || !resumeName.trim() ? '#d1d5db' : '#111827',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 600,
                cursor: saving || !resumeName.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {saving ? 'Saving...' : 'View My Resume'}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

// ── Resume List Page ──────────────────────────────────────────────────────────

const MAX_SLOTS = 5

export default function Resume() {
  const [resumes, setResumes]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)

  async function fetchResumes() {
    setLoading(true)
    try {
      const data = await getResumes()
      setResumes(Array.isArray(data) ? data : [])
    } catch {
      setResumes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResumes() }, [])

  const atLimit = resumes.length >= MAX_SLOTS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f9fafb' }}>

      {/* ── Page top bar ── */}
      <div style={{
        height: '52px', background: '#fff', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', padding: '0 24px',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em' }}>RESUME</span>
        <button
          onClick={() => !atLimit && setShowModal(true)}
          disabled={atLimit}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', background: '#fff',
            color: atLimit ? '#9ca3af' : '#111827',
            border: `1.5px solid ${atLimit ? '#e5e7eb' : '#d1d5db'}`,
            borderRadius: '8px', fontSize: '13px', fontWeight: 600,
            cursor: atLimit ? 'not-allowed' : 'pointer',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Add Resume
        </button>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

        {/* Slot info bar */}
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
          padding: '12px 18px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <ProgressRing value={resumes.length} max={MAX_SLOTS} />
          <span style={{ fontSize: '13.5px', color: '#374151' }}>
            You have <strong>{resumes.length}</strong> resume{resumes.length !== 1 ? 's' : ''} saved out of{' '}
            <strong>{MAX_SLOTS}</strong> available slots.
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <button
              title="You can store up to 5 resumes. Set one as Primary to use it for job matching."
              style={{
                background: 'none', border: '1.5px solid #e5e7eb', borderRadius: '50%',
                width: '22px', height: '22px', cursor: 'default',
                color: '#9ca3af', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >?</button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>

          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 40px',
            padding: '10px 20px', borderBottom: '1px solid #f3f4f6',
            fontSize: '11.5px', fontWeight: 600, color: '#9ca3af',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            <span>Resume</span>
            <span>Target Job Title</span>
            <span>Last Modified</span>
            <span>Created</span>
            <span />
          </div>

          {loading && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
              Loading resumes...
            </div>
          )}

          {/* Empty state */}
          {!loading && resumes.length === 0 && (
            <div style={{
              padding: '64px 20px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="10" y="6" width="36" height="46" rx="4" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2"/>
                <line x1="18" y1="20" x2="38" y2="20" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18" y1="28" x2="38" y2="28" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18" y1="36" x2="30" y2="36" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="48" cy="48" r="12" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
                <line x1="48" y1="42" x2="48" y2="52" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"/>
                <polyline points="44,46 48,42 52,46" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>No resumes yet</p>
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Upload your first resume to get started</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  padding: '9px 20px', background: '#111827', color: '#fff',
                  border: 'none', borderRadius: '8px', fontSize: '13.5px',
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                + Add Resume
              </button>
            </div>
          )}

          {/* Resume rows */}
          {!loading && resumes.map((resume, i) => (
            <div
              key={resume.id}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 40px',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: i < resumes.length - 1 ? '1px solid #f9fafb' : 'none',
                cursor: 'default',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
              onMouseLeave={(e) => e.currentTarget.style.background = ''}
            >
              {/* Resume name col */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                {/* Letter avatar */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                  background: avatarColor(resume.name),
                  color: '#fff', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '15px', fontWeight: 700,
                }}>
                  {(resume.name || 'R')[0].toUpperCase()}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '14px', fontWeight: 600, color: '#111827',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px',
                    }}>
                      {resume.name || resume.fileName}
                    </span>
                    {resume.isPrimary && (
                      <span style={{
                        background: '#dcfce7', color: '#15803d',
                        fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px', flexShrink: 0,
                      }}>
                        ★ PRIMARY
                      </span>
                    )}
                  </div>
                  {resume.analysisStatus === 'Complete' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#16a34a', fontWeight: 500 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle cx="5" cy="5" r="4.5" stroke="#16a34a"/>
                        <path d="M3 5l1.5 1.5L7 3.5" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Analysis Complete
                    </span>
                  )}
                </div>
              </div>

              {/* Target job title col */}
              <span style={{ fontSize: '13.5px', color: resume.targetJobTitle ? '#374151' : '#9ca3af' }}>
                {resume.targetJobTitle || '—'}
              </span>

              {/* Last modified col */}
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{formatDate(resume.lastModifiedAt)}</span>

              {/* Created col */}
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{formatDate(resume.uploadedAt)}</span>

              {/* Overflow menu stub */}
              <button
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9ca3af', padding: '4px', borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="More options"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchResumes}
        />
      )}
    </div>
  )
}
