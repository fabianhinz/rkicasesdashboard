import { Container, createStyles, makeStyles, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'

import { Summary as SummaryModel, SummaryPercent } from '../model/model'
import { percentageOf, summUp } from '../services/utility'
import Charts from './Charts/Charts'
import { useConfigContext } from './Provider/ConfigProvider'
import EsriProvider from './Provider/EsriProvider'
import { useFirestoreContext } from './Provider/FirestoreProvider'
import Settings from './Settings/Settings'
import Summary from './Summary/Summary'

const useStyles = makeStyles(theme =>
    createStyles({
        app: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            userSelect: 'none',
        },
    })
)

const App = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const { firestoreData, firestoreDispatch } = useFirestoreContext()
    const { config } = useConfigContext()

    const [maxAxisDomain, setMaxAxisDomain] = useState<number | undefined>(undefined)

    const classes = useStyles()

    useEffect(() => {
        setSnackbarOpen(Boolean(firestoreData.summary?.lastUpdate))
    }, [firestoreData.summary])

    useEffect(() => {
        const forEnabledStates = (state: string) =>
            config.enabledStates.size > 0 ? config.enabledStates.has(state) : true

        const doublingRates = (from: 'today' | 'yesterday') =>
            summUp(
                Array.from(firestoreData.byState.entries())
                    .filter(([state]) => forEnabledStates(state))
                    .map(
                        ([_state, dayData]) =>
                            dayData[from === 'today' ? dayData.length - 1 : dayData.length - 2]
                    ),
                'doublingRate'
            ) / (config.enabledStates.size > 0 ? config.enabledStates.size : 16)

        const today = firestoreData.today.filter(({ state }) => forEnabledStates(state))
        const recoveredToday = firestoreData.recoveredToday.filter(({ state }) =>
            forEnabledStates(state)
        )
        const summary: SummaryModel = {
            cases: summUp(today, 'cases'),
            deaths: summUp(today, 'deaths'),
            delta: summUp(today, 'delta'),
            rate:
                config.enabledStates.size === 16 || config.enabledStates.size === 0
                    ? // ? pupulation 83,02 Millionen (2019)
                      summUp(today, 'cases') / 830
                    : summUp(today, 'rate') / today.length,
            lastUpdate: today.reduce((acc, doc) => (acc = doc.timestamp.toDate()), new Date()),
            doublingRate: doublingRates('today'),
            recovered: summUp(recoveredToday, 'recovered'),
        }

        const yesterday = firestoreData.yesterday.filter(({ state }) => forEnabledStates(state))
        const summaryPercent: SummaryPercent = {
            cases: percentageOf(summary.cases, summUp(yesterday, 'cases')).formatted,
            deaths: percentageOf(summary.deaths, summUp(yesterday, 'deaths')).formatted,
            delta: percentageOf(summary.delta, summUp(yesterday, 'delta')).formatted,
            rate: percentageOf(summary.rate, summUp(yesterday, 'rate') / yesterday.length)
                .formatted,
            doublingRate: percentageOf(summary.doublingRate, doublingRates('yesterday')).formatted,
            recovered: percentageOf(
                summary.recovered,
                summary.recovered - summUp(recoveredToday, 'delta')
            ).formatted,
        }
        firestoreDispatch({ type: 'stateChange', state: { summary, summaryPercent } })

        if (config.enabledStates.size === 0) return
        // ? lets get our domain data (the max value of visible charts)
        const recoveredDomain = recoveredToday.map(data => data.recovered).sort((a, b) => b - a)[0]
        const byStateDomain: number | undefined = Array.from(firestoreData.byState.entries())
            .filter(([state]) => forEnabledStates(state))
            .map(([_, data]) => data)
            .flat()
            .map(data =>
                Object.keys(data)
                    // ? defeat ts index signature...
                    .map(key => ((config.visibleCharts as any)[key] ? (data as any)[key] : false))
                    .filter(Boolean)
            )
            .flat()
            .sort((a, b) => b - a)[0]

        setMaxAxisDomain(Math.ceil(byStateDomain || recoveredDomain))
    }, [
        config.enabledStates,
        config.visibleCharts,
        firestoreData.byState,
        firestoreData.recoveredToday,
        firestoreData.today,
        firestoreData.yesterday,
        firestoreDispatch,
    ])

    return (
        <div className={classes.app}>
            <Container maxWidth="xl">
                <EsriProvider>
                    <Summary />
                    {config.settings.dashboard && <Charts maxAxisDomain={maxAxisDomain} />}
                </EsriProvider>
            </Container>
            <Settings />
            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                autoHideDuration={4000}>
                <Alert severity="info" onClose={() => setSnackbarOpen(false)}>
                    Zuletzt aktualisiert am {firestoreData.summary?.lastUpdate.toLocaleString()}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default App
