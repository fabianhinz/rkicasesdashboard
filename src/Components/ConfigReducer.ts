import { Reducer, useReducer } from 'react'

import { Settings, VisibleCharts } from '../model/model'

export interface ConfigState {
    enabledStates: Set<string>
    visibleCharts: VisibleCharts
    settings: Settings
}

export type ConfigActions =
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
        doublingRate: true,
        delta: true,
        cases: false,
        rate: true,
        deaths: false,
    },
    settings: {
        log: true,
        showAxis: false,
        showLegend: true,
        grid: true,
        percentage: false,
        syncTooltip: true,
        normalize: true,
        ratio: 2,
    },
}

export const useConfigReducer = () => useReducer(reducer, initialState)
