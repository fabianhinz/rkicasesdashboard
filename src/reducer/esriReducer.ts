import { Reducer, useReducer } from 'react'

import { Attributes, County } from '../model/model'

export interface EsriState {
    loading: boolean
    errorMsg?: string
    rateByState: Map<string, County[]>
    deathsByState: Map<string, County[]>
    casesByState: Map<string, County[]>
}

export type AttributesKey = keyof Pick<Attributes, 'cases_per_100k' | 'deaths' | 'cases'>

export type EsriActions =
    | { type: 'loadingChange'; loading: boolean }
    | {
          type: 'byStateChange'
          byState: Map<string, County[]>
          attributesKey: AttributesKey
      }
    | { type: 'errorMsgChange'; errorMsg: string }

const reducer: Reducer<EsriState, EsriActions> = (state, actions) => {
    switch (actions.type) {
        case 'loadingChange': {
            return { ...state, loading: actions.loading }
        }
        case 'byStateChange': {
            const stateKey: keyof Omit<EsriState, 'loading'> =
                actions.attributesKey === 'cases'
                    ? 'casesByState'
                    : actions.attributesKey === 'cases_per_100k'
                    ? 'rateByState'
                    : 'deathsByState'

            return { ...state, [stateKey]: actions.byState }
        }
        case 'errorMsgChange': {
            return { ...state, errorMsg: actions.errorMsg }
        }
    }
}

const initialState: EsriState = {
    loading: true,
    rateByState: new Map(),
    deathsByState: new Map(),
    casesByState: new Map(),
}

export const useEsriReducer = () => useReducer(reducer, initialState)
