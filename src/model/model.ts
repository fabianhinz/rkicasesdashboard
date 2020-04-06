import { ReactText } from 'react'

export interface RkiData {
    state: string
    cases: number
    delta: number
    rate: number
    deaths: number
    mostAffected?: string
    timestamp: firebase.firestore.Timestamp
}

export interface Summary
    extends Record<keyof Pick<RkiData, 'delta' | 'cases' | 'rate' | 'deaths'>, ReactText> {
    lastUpdate: Date
}

export type StateData = Omit<RkiData, 'state'>

export interface Settings {
    log: boolean
    showAxis: boolean
    showLegend: boolean
    grid: boolean
    syncTooltip: boolean
    normalize: boolean
    percentage: boolean
}

export type VisibleCharts = Record<keyof Omit<Summary, 'lastUpdate'>, boolean>
