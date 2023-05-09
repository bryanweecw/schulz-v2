'use client'
import React from "react"
import { SummaryObjectMap } from "../MeetingNotes"


interface savedSummaryInfoMap {
  [key: string]: SummaryObjectMap[];
}

interface savedSummaryNotesMap {
  [key: string]: string;
}


interface SummaryContextType {
  savedSummaryInfo: savedSummaryInfoMap
  savedNotes: savedSummaryNotesMap
  setSavedSummaryInfo: (summaryInfo: savedSummaryInfoMap) => void
  setSavedNotes: (notes: savedSummaryNotesMap) => void
}

const SummaryInfoContext = React.createContext<SummaryContextType>({
  savedSummaryInfo: {},
  savedNotes: {},
  setSavedSummaryInfo: () => { },
  setSavedNotes: () => { },
})

export function SummaryInfoContextWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [savedSummaryInfo, setSavedSummaryInfo] = React.useState<savedSummaryInfoMap>({ "current": [] })
  const [savedNotes, setSavedNotes] = React.useState<savedSummaryNotesMap>({ "current": "" })

  return (
    <SummaryInfoContext.Provider
      value={{ savedSummaryInfo, setSavedSummaryInfo, savedNotes, setSavedNotes }}
    >
      {children}
    </SummaryInfoContext.Provider>
  )
}

export function useSummaryInfoContext() {
  return React.useContext(SummaryInfoContext);
}
