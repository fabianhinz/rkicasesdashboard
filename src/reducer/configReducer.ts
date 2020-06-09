import { Reducer, useReducer } from 'react'

import { Settings, VisibleCharts } from '../model/model'

export interface ConfigState {
    enabledStates: Set<string>
    visibleCharts: VisibleCharts
    settings: Settings
    favoriteCounties: Set<string>
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
    | {
          type: 'favoriteCountiesChange'
          favoriteCounties: Set<string>
      }
// ToDo reducer should handle more logic
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
        case 'favoriteCountiesChange': {
            return { ...state, favoriteCounties: actions.favoriteCounties }
        }
    }
}

const initialState: ConfigState = {
    enabledStates: new Set(),
    visibleCharts: {
        doublingRate: false,
        delta: false,
        cases: true,
        rate: false,
        deaths: true,
        recovered: true,
        activeCases: false,
    },
    settings: {
        log: false,
        showAxis: true,
        showLegend: true,
        grid: true,
        percentage: true,
        normalize: true,
        ratio: 3,
    },
    favoriteCounties: new Set(),
}

export const useConfigReducer = () => useReducer(reducer, initialState)
