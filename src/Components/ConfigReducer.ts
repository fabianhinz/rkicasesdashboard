import { Reducer, useReducer } from 'react'

import { Settings, VisibleCharts } from '../model/model'

export interface ConfigState {
    enabledStates: Set<string>
    visibleCharts: VisibleCharts
    settings: Settings
}

export type ConfigActions =
    | ({
          type: 'init'
      } & ConfigState)
    | {
          type: 'enabledStatesChange'
          enabledStates: Set<string>
      }
    | {
          type: 'visibleChartsChange'
          visibleCharts: VisibleCharts
      }
    | {
          type: 'settingsChange'
          settings: Settings
      }

const reducer: Reducer<ConfigState, ConfigActions> = (state, actions) => {
    switch (actions.type) {
        case 'init': {
            return { ...actions }
        }
        case 'enabledStatesChange': {
            return { ...state, enabledStates: actions.enabledStates }
        }
        case 'visibleChartsChange': {
            return { ...state, visibleCharts: actions.visibleCharts }
        }
        case 'settingsChange': {
            return { ...state, settings: actions.settings }
        }
    }
}

const initialState: ConfigState = {
    enabledStates: new Set(),
    visibleCharts: {
        delta: true,
        cases: true,
        rate: false,
        deaths: false,
    },
    settings: {
        log: false,
        showAxis: true,
        showLegend: true,
        grid: true,
    },
}

export const useConfigReducer = () => useReducer(reducer, initialState)
