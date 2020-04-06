import { createStyles, LinearProgress, makeStyles } from '@material-ui/core'
import { FC, useContext, useEffect } from 'react'
import React from 'react'

import { RkiData, StateData } from '../../model/model'
import { firestore } from '../../services/firebase'
import { DataActions, DataState, useDataReducer } from '../DataReducer'

interface Context {
    data: DataState
    dataDispatch: React.Dispatch<DataActions>
}

const Context = React.createContext<Context | null>(null)

export const useDataContext = () => useContext(Context) as Context

const useStyles = makeStyles(theme =>
    createStyles({
        loadingContainer: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
        linearProgress: {
            height: 6,
            width: 300,
        },
    })
)

const Dataprovider: FC = ({ children }) => {
    const [data, dataDispatch] = useDataReducer()

    const classes = useStyles()

    useEffect(
        () =>
            firestore
                .collection('rkicases')
                .orderBy('timestamp', 'desc')
                .limit(32)
                .onSnapshot(snapshot => {
                    const data = snapshot.docs.map(
                        doc => ({ state: doc.id, ...doc.data() } as RkiData)
                    )

                    dataDispatch({
                        type: 'todayChange',
                        today: data.slice(0, data.length / 2),
                    })
                    dataDispatch({
                        type: 'yesterdayChange',
                        yesterday: data.slice(data.length / 2),
                    })
                }),
        [dataDispatch]
    )

    useEffect(
        () =>
            firestore
                .collection('rkicases')
                .orderBy('state', 'asc')
                .orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    const byDay: Map<string, StateData> = new Map()
                    const byState: Map<string, StateData[]> = new Map()

                    const docs = snapshot.docs.map(doc => doc.data() as RkiData)

                    new Set(docs.map(({ timestamp }) => timestamp.seconds)).forEach(seconds => {
                        const day = docs.filter(doc => doc.timestamp.seconds === seconds)

                        byDay.set(day[0].timestamp.toDate().toLocaleDateString(), {
                            cases: day.reduce((acc, doc) => (acc += doc.cases), 0),
                            rate: Math.ceil(
                                day.reduce((acc, doc) => (acc += doc.rate), 0) / day.length
                            ),
                            deaths: day.reduce((acc, doc) => (acc += doc.deaths), 0),
                            delta: day.reduce((acc, doc) => (acc += doc.delta), 0),
                            timestamp: day[0].timestamp,
                        })
                    })
                    dataDispatch({ type: 'byDayChange', byDay })

                    new Set(docs.map(({ state }) => state)).forEach(state =>
                        byState.set(
                            state,
                            docs.filter(doc => doc.state === state)
                        )
                    )
                    dataDispatch({ type: 'byStateChange', byState })
                    dataDispatch({ type: 'loadingChange', loading: false })
                }),
        [dataDispatch]
    )

    if (data.loading)
        return (
            <div className={classes.loadingContainer}>
                <LinearProgress className={classes.linearProgress} />
            </div>
        )

    return <Context.Provider value={{ data, dataDispatch }}>{children}</Context.Provider>
}

export default Dataprovider
