import { useState } from 'react'

export function useFilters() {
  const [activeChips, setActiveChips] = useState([])

  function addChip(label, count = null) {
    setActiveChips((prev) => [...prev, { label, count }])
  }

  function removeChip(index) {
    setActiveChips((prev) => prev.filter((_, i) => i !== index))
  }

  function clearAll() {
    setActiveChips([])
  }

  return { activeChips, addChip, removeChip, clearAll }
}
