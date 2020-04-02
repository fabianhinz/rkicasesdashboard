import {
    Container,
    createStyles,
    Divider,
    Grid,
    GridSize,
    LinearProgress,
    Link,
    makeStyles,
    useMediaQuery,
} from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import React, { useEffect, useMemo, useState } from 'react'

import { RkiData, StateData } from '../model/model'
import { firestore } from '../services/firebase'
import { useConfigContext } from './Provider/Configprovider'
import { useDataContext } from './Provider/Dataprovider'
import Settings from './Settings/Settings'
import State from './State/State'
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

    const classes = useStyles({ settingsOpen })

    useEffect(() => {
        setSettingsOpen(highRes)
    }, [highRes])

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
                }),
        [dataDispatch]
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
                            config.enabledStates.size > 0 ? config.enabledStates.has(state) : true
                        )

                    dataDispatch({
                        type: 'summaryChange',
                        summary: {
                            lastUpdate: docs[0].timestamp.toDate(),
                            cases: docs.reduce((acc, doc) => (acc += doc.cases), 0),
                            rate: Math.ceil(
                                docs.reduce((acc, doc) => (acc += doc.rate), 0) / docs.length
                            ),
                            deaths: docs.reduce((acc, doc) => (acc += doc.deaths), 0),
                            delta: docs.reduce((acc, doc) => (acc += doc.delta), 0),
                        },
                    })
                }),
        [config.enabledStates, dataDispatch]
    )

    const gridBreakpointProps: Partial<Record<Breakpoint, boolean | GridSize>> = useMemo(
        () =>
            config.settings.grid
                ? {
                      xs: 12,
                      lg: 6,
                      xl: 4,
                  }
                : { xs: 12 },
        [config.settings.grid]
    )

    if (data.loading)
        return (
            <div className={classes.loadingContainer}>
                <LinearProgress className={classes.linearProgress} variant="query" />
            </div>
        )

    return (
        <div className={classes.app}>
            <Container maxWidth="xl" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} className={classes.itemSummary}>
                        <Summary />
                    </Grid>

                    {config.enabledStates.size === 0 && (
                        <Grid item xs={12}>
                            <State
                                title="Deutschland"
                                data={[...data.byDay.values()]}
                                settings={config.settings}
                                visibleCharts={config.visibleCharts}
                            />
                        </Grid>
                    )}

                    {[...data.byState.entries()]
                        .filter(([state]) => config.enabledStates.has(state))
                        .map(([state, data]) => (
                            <Grid item {...gridBreakpointProps} key={state}>
                                <State
                                    title={state}
                                    data={data}
                                    settings={config.settings}
                                    visibleCharts={config.visibleCharts}
                                />
                            </Grid>
                        ))}

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justify="center" spacing={2}>
                            <Grid item>
                                <Link
                                    target="_blank"
                                    href="https://github.com/fabianhinz/rkicasesapi">
                                    Datenquelle
                                    {data.summary &&
                                        ` (${data.summary.lastUpdate.toLocaleDateString()})`}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    target="_blank"
                                    href="https://github.com/fabianhinz/rkicasesdashboard">
                                    Quellcode
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    target="_blank"
                                    href="https://www.flaticon.com/authors/freepik">
                                    Icons made by Freepik
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    target="_blank"
                                    href="http://simplemaps.com/resources/svg-maps">
                                    Karte von simplemaps
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
    )
}

export default App
