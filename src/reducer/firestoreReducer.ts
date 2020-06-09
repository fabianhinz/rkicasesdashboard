import { Reducer, useReducer } from 'react'

import { Recovered, RecoveredData, RkiData, StateData } from '../model/model'

export interface FirestoreState {
    loading: boolean
    byDay: Map<string, StateData>
    byState: Map<string, StateData[]>
    today: RkiData[]
    yesterday: RkiData[]
    recoveredToday: Recovered[]
    recoveredByDay: Map<string, RecoveredData>
    recoveredByState: Map<string, RecoveredData[]>
}

export type FirestoreActions = { type: 'stateChange'; state: Partial<FirestoreState> }
// ? well this is not how a reducer should be used
const reducer: Reducer<FirestoreState, FirestoreActions> = (state, actions) => ({
    ...state,
    ...actions.state,
})

const initialState: FirestoreState = {
    loading: true,
    byDay: new Map(),
    byState: new Map(),

    today: [],
    yesterday: [],
    recoveredToday: [],
    recoveredByDay: new Map(),
    recoveredByState: new Map(),
}

export const useFirestoreReducer = () => useReducer(reducer, initialState)
