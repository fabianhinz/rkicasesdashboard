import { createStyles, LinearProgress, makeStyles } from '@material-ui/core'
import { FC, useContext, useEffect } from 'react'
import React from 'react'

import { Recovered, RecoveredData, RkiData, StateData } from '../../model/model'
import {
    FirestoreActions,
    FirestoreState,
    useFirestoreReducer,
} from '../../reducer/firestoreReducer'
import { firestore } from '../../services/firebase'
import { calculateDoublingRates, summUp } from '../../services/utility'

interface Context {
    firestoreData: FirestoreState
    firestoreDispatch: React.Dispatch<FirestoreActions>
}

const Context = React.createContext<Context | null>(null)

export const useFirestoreContext = () => useContext(Context) as Context

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

const FirestoreProvider: FC = ({ children }) => {
    const [firestoreData, firestoreDispatch] = useFirestoreReducer()

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

                    firestoreDispatch({
                        type: 'stateChange',
                        state: {
                            today: data.slice(0, data.length / 2),
                            yesterday: data.slice(data.length / 2),
                        },
                    })
                }),
        [firestoreDispatch]
    )

    useEffect(
        () =>
            firestore
                .collection('rkirecovered')
                .orderBy('timestamp', 'desc')
                .limit(16)
                .onSnapshot(snapshot => {
                    firestoreDispatch({
                        type: 'stateChange',
                        state: {
                            recoveredToday: snapshot.docs.map(doc => doc.data() as Recovered),
                        },
                    })
                }),
        [firestoreDispatch]
    )

    useEffect(
        () =>
            firestore
                .collection('rkirecovered')
                .orderBy('state', 'asc')
                .orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    const recoveredByDay: Map<string, RecoveredData> = new Map()
                    const recoveredByState: Map<string, RecoveredData[]> = new Map()

                    const docs = snapshot.docs.map(doc => doc.data() as Recovered)

                    new Set(docs.map(({ state }) => state)).forEach(state =>
                        recoveredByState.set(
                            state,
                            docs.filter(doc => doc.state === state)
                        )
                    )

                    new Set(docs.map(({ timestamp }) => timestamp.seconds)).forEach(seconds => {
                        const day = Array.from(recoveredByState.values())
                            .map(stateData =>
                                stateData.filter(({ timestamp }) => timestamp.seconds === seconds)
                            )
                            .flat()

                        recoveredByDay.set(day[0].timestamp.toDate().toLocaleDateString(), {
                            delta: summUp(day, 'delta'),
                            recovered: summUp(day, 'recovered'),
                            timestamp: day[0].timestamp,
                        })
                    })

                    firestoreDispatch({
                        type: 'stateChange',
                        state: {
                            recoveredByDay,
                            recoveredByState,
                        },
                    })
                }),
        [firestoreDispatch]
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
                    firestoreDispatch({
                        type: 'stateChange',
                        state: { byState, byDay, loading: false },
                    })
                }),
        [firestoreDispatch]
    )

    if (firestoreData.loading)
        return (
            <div className={classes.loadingContainer}>
                <LinearProgress className={classes.linearProgress} />
            </div>
        )

    return (
        <Context.Provider value={{ firestoreData, firestoreDispatch }}>{children}</Context.Provider>
    )
}

export default FirestoreProvider
