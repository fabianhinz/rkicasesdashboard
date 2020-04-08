import { createStyles, LinearProgress, makeStyles } from '@material-ui/core'
import { FC, useContext, useEffect } from 'react'
import React from 'react'

import { RkiData, StateData } from '../../model/model'
import { firestore } from '../../services/firebase'
import { calculateDoublingRates, summUp } from '../../services/utility'
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
                        doc => ({ state: doc.id, ...doc.data() } as Omit<RkiData, 'doublingRate'>)
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

                    const docs = snapshot.docs.map(
                        doc => doc.data() as Omit<RkiData, 'doublingRate'>
                    )

                    new Set(docs.map(({ state }) => state)).forEach(state =>
                        byState.set(
                            state,
                            calculateDoublingRates(docs.filter(doc => doc.state === state))
                        )
                    )
                    dataDispatch({ type: 'byStateChange', byState })

                    new Set(docs.map(({ timestamp }) => timestamp.seconds)).forEach(seconds => {
                        const day = Array.from(byState.values())
                            .map(stateData =>
                                stateData.filter(({ timestamp }) => timestamp.seconds === seconds)
                            )
                            .flat()

                        byDay.set(day[0].timestamp.toDate().toLocaleDateString(), {
                            cases: summUp(day, 'cases'),
                            deaths: summUp(day, 'deaths'),
                            delta: summUp(day, 'delta'),
                            timestamp: day[0].timestamp,
                            rate: summUp(day, 'rate') / day.length,
                            doublingRate: summUp(day, 'doublingRate') / day.length,
                        })
                    })
                    dataDispatch({ type: 'byDayChange', byDay })
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
