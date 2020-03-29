export interface RkiData {
    id: string
    state: string
    cases: number
    delta: string
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
}

export type State = string

export type CasesByState = Map<State, Omit<RkiData, 'state'>[]>

export interface Settings {
    log: boolean
    showAxis: boolean
    showLegend: boolean
}
