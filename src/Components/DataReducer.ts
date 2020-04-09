import { Reducer, useReducer } from 'react'

import { RkiData, StateData, Summary, SummaryPercent } from '../model/model'

export interface DataState {
    loading: boolean
    byDay: Map<string, StateData>
    byState: Map<string, StateData[]>
    summary: Summary | null
    summaryPercent: SummaryPercent | null
    today: RkiData[]
    yesterday: RkiData[]
}

export type DataActions =
    | { type: 'byDayChange'; byDay: Map<string, StateData> }
    | { type: 'byStateChange'; byState: Map<string, StateData[]> }
    | { type: 'summaryChange'; summary: Summary }
    | { type: 'todayChange'; today: RkiData[] }
    | { type: 'yesterdayChange'; yesterday: RkiData[] }
    | { type: 'loadingChange'; loading: boolean }
    | {
          type: 'summaryPercentChange'
          summaryPercent: SummaryPercent
      }

const reducer: Reducer<DataState, DataActions> = (state, actions) => {
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
        case 'yesterdayChange': {
            return { ...state, yesterday: actions.yesterday }
        }
        case 'loadingChange': {
            return { ...state, loading: actions.loading }
        }
        case 'summaryPercentChange': {
            return { ...state, summaryPercent: actions.summaryPercent }
        }
    }
}

const initialState: DataState = {
    loading: true,
    byDay: new Map(),
    byState: new Map(),
    summary: null,
    summaryPercent: null,
    today: [],
    yesterday: [],
}

export const useDataReducer = () => useReducer(reducer, initialState)
