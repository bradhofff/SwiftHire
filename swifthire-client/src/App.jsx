import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LeftNav from './components/layout/LeftNav.jsx'
import JobBoard from './pages/JobBoard.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Applied from './pages/Applied.jsx'
import Pipeline from './pages/Pipeline.jsx'
import Resume from './pages/Resume.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <LeftNav />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/applied" element={<Applied />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
