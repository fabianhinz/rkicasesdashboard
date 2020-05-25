import { Container, createStyles, makeStyles, useMediaQuery } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { Summary as SummaryModel, SummaryPercent } from '../model/model'
import { percentageOf, summUp } from '../services/utility'
import Charts from './Charts/Charts'
import Footer from './Footer'
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
            paddingBottom: 56 + theme.spacing(3),
            [theme.breakpoints.up('sm')]: {
                paddingBottom: 64 + theme.spacing(3),
            },
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

    const highRes = useMediaQuery('(min-width: 1101px)')

    const [settingsOpen, setSettingsOpen] = useState(false)
    const [maxAxisDomain, setMaxAxisDomain] = useState<number | undefined>(undefined)

    const classes = useStyles({ settingsOpen })

    useEffect(() => {
        setSettingsOpen(highRes)
    }, [highRes])

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
        const visibleChartsData: number[][] = today.map(data =>
            Object.keys(data)
                // ? defeat ts index signature...
                .map(key => ((config.visibleCharts as any)[key] ? (data as any)[key] : false))
                .filter(Boolean)
        )

        if (visibleChartsData.flat().filter(Boolean).length > 0) {
            setMaxAxisDomain(visibleChartsData.flat().sort((a, b) => b - a)[0])
        } else if (config.visibleCharts.recovered) {
            const recoveredDomain = recoveredToday
                .map(data => data.recovered)
                .sort((a, b) => b - a)[0]

            setMaxAxisDomain(recoveredDomain)
        } else if (config.visibleCharts.doublingRate) {
            const doublingRateDomain = Array.from(firestoreData.byState.entries())
                .filter(([state]) => forEnabledStates(state))
                .map(([_, data]) => data)
                .flat()
                .map(data => data.doublingRate)
                .filter(Boolean)
                .sort((a, b) => b! - a!)[0] as number

            setMaxAxisDomain(Math.ceil(doublingRateDomain))
        }
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
            <Container maxWidth="xl" className={classes.container}>
                <Summary />
                <Charts maxAxisDomain={maxAxisDomain} />
            </Container>

            <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
            <Footer lastUpdate={firestoreData.summary?.lastUpdate.toLocaleDateString()} />
        </div>
    )
}

export default App
