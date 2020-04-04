import { Reducer, useReducer } from 'react'

import { RkiData, StateData, Summary } from '../model/model'

export interface DataState {
    loading: boolean
    byDay: Map<string, StateData>
    byState: Map<string, StateData[]>
    summary: Summary | null
    today: RkiData[]
}

export type DataActions =
    | { type: 'byDayChange'; byDay: Map<string, StateData> }
    | { type: 'byStateChange'; byState: Map<string, StateData[]> }
    | { type: 'summaryChange'; summary: Summary | null }
    | { type: 'todayChange'; today: RkiData[] }

const reducer: Reducer<DataState, DataActions> = (state, actions) => {
    state.loading = false
    switch (actions.type) {
        case 'byDayChange': {
            return { ...state, byDay: actions.byDay }
        }
        case 'byStateChange': {
            return { ...state, byState: actions.byState }
        }
        case 'summaryChange': {
            return { ...state, summary: actions.summary }
        }
        case 'todayChange': {
            return { ...state, today: actions.today }
        }
    }
}

const initialState: DataState = {
    loading: true,
    byDay: new Map(),
    byState: new Map(),
    summary: null,
    today: [],
}

export const useDataReducer = () => useReducer(reducer, initialState)
