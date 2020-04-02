import { FC, useCallback, useContext, useEffect } from 'react'
import React from 'react'

import { Settings, VisibleCharts } from '../../model/model'
import { getOrThrow } from '../../services/db'
import { ConfigActions, ConfigState, useConfigReducer } from '../ConfigReducer'

interface Context {
    config: ConfigState
    configDispatch: React.Dispatch<ConfigActions>
}

const Context = React.createContext<Context | null>(null)

export const useConfigContext = () => useContext(Context) as Context

const Configprovider: FC = ({ children }) => {
    const [config, configDispatch] = useConfigReducer()

    const getInitialConfig = useCallback(async () => {
        try {
            configDispatch({
                type: 'init',
                enabledStates: await getOrThrow<Set<string>>('enabledStates'),
                visibleCharts: await getOrThrow<VisibleCharts>('visibleCharts'),
                settings: await getOrThrow<Settings>('settings'),
            })
        } catch {
            // ? Promise rejected: we just didn't save anything in the IndexedDB - yet
        }
    }, [configDispatch])

    useEffect(() => {
        getInitialConfig()
    }, [getInitialConfig])

    return <Context.Provider value={{ config, configDispatch }}>{children}</Context.Provider>
}

export default Configprovider
