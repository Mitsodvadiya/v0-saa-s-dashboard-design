"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { STUDIES, type Study } from "./study-access-data"

interface StudyContextType {
  selectedStudy: Study | null
  setSelectedStudy: (study: Study | null) => void
}

const StudyContext = createContext<StudyContextType | undefined>(undefined)

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [selectedStudy, setSelectedStudyState] = useState<Study | null>(null)

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedStudyId")
    if (saved) {
      const study = STUDIES.find((s) => s.id === saved)
      if (study) setSelectedStudyState(study)
    }
  }, [])

  const setSelectedStudy = (study: Study | null) => {
    setSelectedStudyState(study)
    if (study) {
      localStorage.setItem("selectedStudyId", study.id)
    } else {
      localStorage.removeItem("selectedStudyId")
    }
  }

  return (
    <StudyContext.Provider value={{ selectedStudy, setSelectedStudy }}>
      {children}
    </StudyContext.Provider>
  )
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (context === undefined) {
    throw new Error("useStudy must be used within a StudyProvider")
  }
  return context
}
