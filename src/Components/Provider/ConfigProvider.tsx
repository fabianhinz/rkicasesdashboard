import { FC, useCallback, useContext, useEffect } from 'react'
import React from 'react'

import { Settings, VisibleCharts } from '../../model/model'
import { ConfigActions, ConfigState, useConfigReducer } from '../../reducer/configReducer'
import { getOrThrow } from '../../services/db'

interface Context {
    config: ConfigState
    configDispatch: React.Dispatch<ConfigActions>
}

const Context = React.createContext<Context | null>(null)

export const useConfigContext = () => useContext(Context) as Context

const ConfigProvider: FC = ({ children }) => {
    const [config, configDispatch] = useConfigReducer()

    const getInitialConfig = useCallback(() => {
        getOrThrow<Set<string>>('enabledStates')
            .then(enabledStates =>
                configDispatch({
                    type: 'enabledStatesChange',
                    enabledStates,
                })
            )
            .catch(console.error)

        getOrThrow<VisibleCharts>('visibleCharts')
            .then(visibleCharts =>
                configDispatch({
                    type: 'visibleChartsChange',
                    visibleCharts,
                })
            )
            .catch(console.error)

        getOrThrow<Settings>('settings')
            .then(settings =>
                configDispatch({
                    type: 'settingsChange',
                    settings: { ratio: settings.ratio || 2, ...settings },
                })
            )
            .catch(console.error)

        getOrThrow<Set<string>>('favoriteCounties')
            .then(favoriteCounties =>
                configDispatch({
                    type: 'favoriteCountiesChange',
                    favoriteCounties,
                })
            )
            .catch(console.error)
    }, [configDispatch])

    useEffect(() => {
        getInitialConfig()
    }, [getInitialConfig])

    return <Context.Provider value={{ config, configDispatch }}>{children}</Context.Provider>
}

export default ConfigProvider
