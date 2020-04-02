import { FC, useContext } from 'react'
import React from 'react'

import { DataActions, DataState, useDataReducer } from '../DataReducer'

interface Context {
    data: DataState
    dataDispatch: React.Dispatch<DataActions>
}

const Context = React.createContext<Context | null>(null)

export const useDataContext = () => useContext(Context) as Context

const Dataprovider: FC = ({ children }) => {
    const [data, dataDispatch] = useDataReducer()

    return <Context.Provider value={{ data, dataDispatch }}>{children}</Context.Provider>
}

export default Dataprovider
