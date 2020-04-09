import {
    Container,
    createStyles,
    Divider,
    Grid,
    makeStyles,
    useMediaQuery,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import { Summary as SummaryModel, SummaryPercent } from '../model/model'
import { percentageOf, summUp } from '../services/utility'
import Charts from './Charts/Charts'
import Footer from './Footer'
import { useConfigContext } from './Provider/Configprovider'
import { useDataContext } from './Provider/Dataprovider'
import Settings from './Settings/Settings'
import Summary from './Summary/Summary'

interface StyleProps {
    settingsOpen: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        app: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
            userSelect: 'none',
        },
        itemSummary: {
            [theme.breakpoints.up('md')]: {
                position: 'sticky',
                top: 'calc(env(safe-area-inset-top) + 12px)',
                zIndex: theme.zIndex.appBar,
            },
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
    const { data, dataDispatch } = useDataContext()
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
                Array.from(data.byState.entries())
                    .filter(([state]) => forEnabledStates(state))
                    .map(
                        ([_state, dayData]) =>
                            dayData[from === 'today' ? dayData.length - 1 : dayData.length - 2]
                    ),
                'doublingRate'
            ) / (config.enabledStates.size > 0 ? config.enabledStates.size : 16)

        const today = data.today.filter(({ state }) => forEnabledStates(state))
        const summary: SummaryModel = {
            cases: summUp(today, 'cases'),
            deaths: summUp(today, 'deaths'),
            delta: summUp(today, 'delta'),
            rate: summUp(today, 'rate') / today.length,
            lastUpdate: today.reduce((acc, doc) => (acc = doc.timestamp.toDate()), new Date()),
            doublingRate: doublingRates('today'),
        }
        dataDispatch({
            type: 'summaryChange',
            summary,
        })

        const yesterday = data.yesterday.filter(({ state }) => forEnabledStates(state))
        const summaryPercent: SummaryPercent = {
            cases: percentageOf(summary.cases, summUp(yesterday, 'cases')).formatted,
            deaths: percentageOf(summary.deaths, summUp(yesterday, 'deaths')).formatted,
            delta: percentageOf(summary.delta, summUp(yesterday, 'delta')).formatted,
            rate: percentageOf(summary.rate, summUp(yesterday, 'rate') / yesterday.length)
                .formatted,
            doublingRate: percentageOf(summary.doublingRate, doublingRates('yesterday')).formatted,
        }
        dataDispatch({ type: 'summaryPercentChange', summaryPercent })

        if (config.enabledStates.size === 0) return
        // ? lets get our domain data (the max value of visible charts)
        const visibleChartsData: number[][] = today.map(data =>
            Object.keys(data)
                // ? defeat ts index signature...
                .map(key => ((config.visibleCharts as any)[key] ? (data as any)[key] : false))
                .filter(Boolean)
        )

        setMaxAxisDomain(visibleChartsData.flat().sort((a, b) => b - a)[0])
    }, [
        config.enabledStates,
        config.settings.percentage,
        config.visibleCharts,
        data.byDay,
        data.byState,
        data.today,
        data.yesterday,
        dataDispatch,
    ])

    return (
        <div className={classes.app}>
            <Container maxWidth="xl" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} className={classes.itemSummary}>
                        <Summary />
                    </Grid>

                    <Grid item xs={12}>
                        <Charts maxAxisDomain={maxAxisDomain} />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Footer lastUpdate={data.summary?.lastUpdate} />
                    </Grid>
                </Grid>
            </Container>

            <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
    )
}

export default App
