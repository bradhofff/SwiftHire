import React from 'react'

const icons = {
  briefcase: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
    />
  ),
  'file-text': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="13" x2="8" y2="13" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="17" x2="8" y2="17" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="10 9 9 9 8 9" />
    </>
  ),
  user: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle strokeLinecap="round" strokeLinejoin="round" cx="12" cy="7" r="4" />
    </>
  ),
  cpu: (
    <>
      <rect strokeLinecap="round" strokeLinejoin="round" x="9" y="9" width="6" height="6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      <rect strokeLinecap="round" strokeLinejoin="round" x="2" y="2" width="20" height="20" rx="2" />
    </>
  ),
  'book-open': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"
    />
  ),
  search: (
    <>
      <circle strokeLinecap="round" strokeLinejoin="round" cx="11" cy="11" r="8" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  x: (
    <>
      <line strokeLinecap="round" strokeLinejoin="round" x1="18" y1="6" x2="6" y2="18" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  'map-pin': (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle strokeLinecap="round" strokeLinejoin="round" cx="12" cy="10" r="3" />
    </>
  ),
  monitor: (
    <>
      <rect strokeLinecap="round" strokeLinejoin="round" x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="8" y1="21" x2="16" y2="21" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="12" y1="17" x2="12" y2="21" />
    </>
  ),
  clock: (
    <>
      <circle strokeLinecap="round" strokeLinejoin="round" cx="12" cy="12" r="10" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="12 6 12 12 16 14" />
    </>
  ),
  users: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle strokeLinecap="round" strokeLinejoin="round" cx="9" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  dollar: (
    <>
      <line strokeLinecap="round" strokeLinejoin="round" x1="12" y1="1" x2="12" y2="23" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </>
  ),
  heart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
    />
  ),
  bell: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </>
  ),
  'chevron-down': (
    <polyline strokeLinecap="round" strokeLinejoin="round" points="6 9 12 15 18 9" />
  ),
  check: (
    <polyline strokeLinecap="round" strokeLinejoin="round" points="20 6 9 17 4 12" />
  ),
  lock: (
    <>
      <rect strokeLinecap="round" strokeLinejoin="round" x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
    </>
  ),
  'more-horizontal': (
    <>
      <circle strokeLinecap="round" strokeLinejoin="round" cx="12" cy="12" r="1" />
      <circle strokeLinecap="round" strokeLinejoin="round" cx="19" cy="12" r="1" />
      <circle strokeLinecap="round" strokeLinejoin="round" cx="5" cy="12" r="1" />
    </>
  ),
  zap: (
    <polygon strokeLinecap="round" strokeLinejoin="round" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  ),
  'trending-up': (
    <>
      <polyline strokeLinecap="round" strokeLinejoin="round" points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="17 6 23 6 23 12" />
    </>
  ),
  'message-circle': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
    />
  ),
  settings: (
    <>
      <circle strokeLinecap="round" strokeLinejoin="round" cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </>
  ),
  filter: (
    <polygon strokeLinecap="round" strokeLinejoin="round" points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  ),
  building: (
    <>
      <rect strokeLinecap="round" strokeLinejoin="round" x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01" />
    </>
  ),
  star: (
    <polygon strokeLinecap="round" strokeLinejoin="round" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
  calendar: (
    <>
      <rect strokeLinecap="round" strokeLinejoin="round" x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="2" x2="16" y2="6" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="8" y1="2" x2="8" y2="6" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  'arrow-right': (
    <>
      <line strokeLinecap="round" strokeLinejoin="round" x1="5" y1="12" x2="19" y2="12" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="12 5 19 12 12 19" />
    </>
  ),
  plus: (
    <>
      <line strokeLinecap="round" strokeLinejoin="round" x1="12" y1="5" x2="12" y2="19" />
      <line strokeLinecap="round" strokeLinejoin="round" x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  trash: (
    <>
      <polyline strokeLinecap="round" strokeLinejoin="round" points="3 6 5 6 21 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </>
  ),
  edit: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
}

export default function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.5 }) {
  const path = icons[name]
  if (!path) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {path}
    </svg>
  )
}
