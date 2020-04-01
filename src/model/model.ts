export interface RkiData {
    id: string
    state: string
    cases: number
    delta: number
    rate: number
    deaths: number
    mostAffected: string
    timestamp: firebase.firestore.Timestamp
}

export interface Summary {
    lastUpdate: Date
    cases: number
    deaths: number
    rate: number
    delta: number
}

export type State = string

export type CasesByState = Map<State, StateData>
export type StateData = Omit<RkiData, 'state'>[]

export interface Settings {
    log: boolean
    showAxis: boolean
    showLegend: boolean
    grid: boolean
}

export type VisibleCharts = Record<
    keyof Pick<RkiData, 'delta' | 'cases' | 'rate' | 'deaths'>,
    boolean
> & { [index: string]: boolean }
