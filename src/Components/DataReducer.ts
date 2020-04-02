import { Reducer, useReducer } from 'react'

import { StateData, Summary } from '../model/model'

export interface DataState {
    loading: boolean
    byDay: Map<string, StateData>
    byState: Map<string, StateData[]>
    summary: Summary | null
}

export type DataActions =
    | { type: 'byDayChange'; byDay: Map<string, StateData> }
    | { type: 'byStateChange'; byState: Map<string, StateData[]> }
    | { type: 'summaryChange'; summary: Summary | null }

const reducer: Reducer<DataState, DataActions> = (state, actions) => {
    switch (actions.type) {
        case 'byDayChange': {
            return { ...state, byDay: actions.byDay, loading: false }
        }
        case 'byStateChange': {
            return { ...state, byState: actions.byState, loading: false }
        }
        case 'summaryChange': {
            return { ...state, summary: actions.summary, loading: false }
        }
    }
}

const initialState: DataState = {
    loading: true,
    byDay: new Map(),
    byState: new Map(),
    summary: null,
}

export const useDataReducer = () => useReducer(reducer, initialState)
