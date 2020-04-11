import { Reducer, useReducer } from 'react'

import { County } from '../model/model'

export interface EsriState {
    loading: boolean

    mostAffectedByState: Map<string, County[]>
}

export type EsriActions =
    | { type: 'loadingChange'; loading: boolean }
    | { type: 'mostAffectedByStateChange'; mostAffectedByState: Map<string, County[]> }

const reducer: Reducer<EsriState, EsriActions> = (state, actions) => {
    switch (actions.type) {
        case 'loadingChange': {
            return { ...state, loading: actions.loading }
        }
        case 'mostAffectedByStateChange': {
            return { ...state, mostAffectedByState: actions.mostAffectedByState }
        }
    }
}

const initialState: EsriState = {
    loading: true,
    mostAffectedByState: new Map(),
}

export const useEsriReducer = () => useReducer(reducer, initialState)
