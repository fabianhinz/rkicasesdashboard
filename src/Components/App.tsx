import {
    Card,
    CardContent,
    CardHeader,
    Container,
    createStyles,
    Divider,
    Grid,
    GridSize,
    Link,
    makeStyles,
} from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { useEffect, useMemo, useState } from 'react'

import {
    CasesByState,
    RkiData,
    Settings as SettingsModel,
    Summary as SummaryModel,
    VisibleCharts,
} from '../model/model'
import { getOrThrow } from '../services/db'
import { createDateFromTimestamp, firestore } from '../services/firebase'
import Settings from './Settings/Settings'
import State from './State/State'
import Summary from './Summary/Summary'

const useStyles = makeStyles(theme =>
    createStyles({
        app: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
            userSelect: 'none',
        },
        itemSummary: {
            position: 'sticky',
            top: 'calc(env(safe-area-inset-top) + 12px)',
            zIndex: theme.zIndex.appBar,
        },
        paperLegend: {
            padding: theme.spacing(2),
        },
    })
)

const App = () => {
    const [enabledStates, setEnabledStates] = useState<Set<string>>(new Set())
    const [casesByState, setCasesByState] = useState<CasesByState>(new Map())
    const [summary, setSummary] = useState<SummaryModel | null>(null)
    const [visibleCharts, setVisibleCharts] = useState<VisibleCharts>({
        delta: true,
        cases: true,
        rate: true,
        deaths: true,
    })
    const [settings, setSettings] = useState<SettingsModel>({
        log: false,
        showAxis: false,
        showLegend: false,
        grid: true,
    })

    const classes = useStyles()

    useEffect(() => {
        getOrThrow<SettingsModel>('settings').then(setSettings).catch(console.error)
        getOrThrow<Set<string>>('enabledStates').then(setEnabledStates).catch(console.error)
        getOrThrow<VisibleCharts>('visibleCharts').then(setVisibleCharts).catch(console.error)
    }, [])

    useEffect(
        () =>
            firestore
                .collection('rkicases')
                .orderBy('state', 'asc')
                .orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    const docs = snapshot.docs.map(doc => ({ ...doc.data() } as RkiData))
                    const states = new Set(docs.map(({ state }) => state))

                    const newCases = new Map()
                    states.forEach(state =>
                        newCases.set(
                            state,
                            docs.filter(doc => doc.state === state)
                        )
                    )

                    setCasesByState(newCases)
                }),
        []
    )

    useEffect(
        () =>
            firestore
                .collection('rkicases')
                .orderBy('timestamp', 'desc')
                // ? in-queries only support up to 10 filters, we have to filter on the client
                .limit(16)
                .onSnapshot(snapshot => {
                    const docs = snapshot.docs
                        .map(doc => ({ ...doc.data() } as RkiData))
                        .filter(({ state }) =>
                            enabledStates.size > 0 ? enabledStates.has(state) : true
                        )

                    setSummary({
                        lastUpdate: createDateFromTimestamp(docs[0].timestamp),
                        cases: docs.reduce((acc, doc) => (acc += doc.cases), 0),
                        rate: Math.ceil(
                            docs.reduce((acc, doc) => (acc += doc.rate), 0) / docs.length
                        ),
                        deaths: docs.reduce((acc, doc) => (acc += doc.deaths), 0),
                        delta: docs.reduce((acc, doc) => (acc += doc.delta), 0),
                    })
                }),
        [enabledStates]
    )

    const gridBreakpointProps: Partial<Record<Breakpoint, boolean | GridSize>> = useMemo(
        () =>
            settings.grid
                ? {
                      xs: 12,
                      sm: 6,
                      lg: 4,
                  }
                : { xs: 12 },
        [settings.grid]
    )

    return (
        <div className={classes.app}>
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} className={classes.itemSummary}>
                        <Summary
                            summary={summary}
                            visibleCharts={visibleCharts}
                            onVisibleChartsChange={setVisibleCharts}
                        />
                    </Grid>

                    {[...casesByState.entries()].map(([state, data]) => (
                        <State
                            state={state}
                            data={data}
                            settings={settings}
                            enabledStates={enabledStates}
                            gridBreakpointProps={gridBreakpointProps}
                            visibleCharts={visibleCharts}
                            key={state}
                        />
                    ))}

                    {casesByState.size === 0 &&
                        new Array(enabledStates.size > 0 ? enabledStates.size : 16)
                            .fill(1)
                            .map((_dummy, index) => (
                                <Grid item {...gridBreakpointProps} key={index}>
                                    <Card elevation={4}>
                                        <CardHeader
                                            title={<Skeleton variant="text" width="40%" />}
                                        />
                                        <CardContent>
                                            <Skeleton variant="rect" width="100%" height={280} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justify="center" spacing={2}>
                            <Grid item>
                                <Link href="https://github.com/fabianhinz/rkicasesapi">
                                    Datenquelle
                                    {summary && ` (${summary.lastUpdate.toLocaleDateString()})`}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="https://github.com/fabianhinz/rkicasesdashboard">
                                    Quellcode
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="https://www.flaticon.com/authors/freepik">
                                    Icons made by Freepik
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Settings
                {...settings}
                states={[...casesByState.keys()]}
                enabledStates={enabledStates}
                onEnabledStatesChange={setEnabledStates}
                onSettingsChange={setSettings}
            />
        </div>
    )
}

export default App
