export interface RkiData {
    state: string
    cases: number
    delta: number
    rate: number
    deaths: number
    doublingRate?: number
    mostAffected?: string
    timestamp: firebase.firestore.Timestamp
}

export interface Summary
    extends Record<
        keyof Pick<RkiData, 'delta' | 'cases' | 'rate' | 'deaths' | 'doublingRate'>,
        number
    > {
    lastUpdate: Date
    recovered: number
    activeCases: number
}

export type SummaryPercent = Record<keyof Omit<Summary, 'lastUpdate'>, string>

export type StateData = Omit<RkiData, 'state'>

export interface Settings {
    log: boolean
    showAxis: boolean
    showLegend: boolean
    grid: boolean
    normalize: boolean
    percentage: boolean
    ratio: number
}

export type VisibleCharts = Record<keyof Omit<Summary, 'lastUpdate'>, boolean> & {
    [index: string]: boolean
}

// ? ext. data source: https://www.esri.de/de-de/home
export interface Attributes {
    county: string
    BL: string
    last_update: string
    cases_per_100k: number
    cases7_per_100k: number
    deaths: number
    cases: number
}

export interface Feature {
    attributes: Attributes
}

export interface County {
    county: string
    value: number
    lastUpdate: string
}

export interface Recovered {
    state: string
    recovered: number
    delta: number
    esriTimestamp: string
    timestamp: firebase.firestore.Timestamp
}

export type RecoveredData = Omit<Recovered, 'state' | 'esriTimestamp'>

export type CombinedStateData = StateData &
    Partial<Pick<RecoveredData, 'recovered'>> & { activeCases?: number }
