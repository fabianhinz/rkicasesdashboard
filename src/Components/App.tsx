import { Container, createStyles, makeStyles } from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'

import { Summary as SummaryModel, SummaryPercent } from '../model/model'
import { percentageOf, summUp } from '../services/utility'
import Charts from './Charts/Charts'
import { useConfigContext } from './Provider/ConfigProvider'
import { useFirestoreContext } from './Provider/FirestoreProvider'
import Settings from './Settings/Settings'
import Summary from './Summary/Summary'

interface StyleProps {
    settingsOpen: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        app: {
            paddingTop: theme.spacing(3),

            userSelect: 'none',
        },
        container: {
            '@media(min-width: 769px) and (max-width: 2559px)': {
                paddingRight: ({ settingsOpen }: StyleProps) => (settingsOpen ? 344 : 24),
            },
            '@media(min-width: 2560px)': {
                paddingRight: 24,
            },
        },
    })
)

const App = () => {
    const { firestoreData, firestoreDispatch } = useFirestoreContext()
    const { config } = useConfigContext()

    const [settingsOpen, setSettingsOpen] = useState(false)
    const [maxAxisDomain, setMaxAxisDomain] = useState<number | undefined>(undefined)

    const classes = useStyles({ settingsOpen })

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

    const memoDashboard = useMemo(
        () => (
            <Container maxWidth="xl" className={classes.container}>
                <Summary />
                {config.settings.dashboard && <Charts maxAxisDomain={maxAxisDomain} />}
            </Container>
        ),
        [classes.container, maxAxisDomain, config.settings.dashboard]
    )

    return (
        <div className={classes.app}>
            {memoDashboard}
            <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
    )
}

export default App
