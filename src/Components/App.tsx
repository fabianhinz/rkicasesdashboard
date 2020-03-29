import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    createStyles,
    Divider,
    Grid,
    Link,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import { amber, red, teal } from '@material-ui/core/colors'
import Skeleton from '@material-ui/lab/Skeleton'
import clsx from 'clsx'
import { scaleSymlog } from 'd3-scale'
import { Calendar, Percent, Sigma, Skull } from 'mdi-material-ui'
import React, { useEffect, useState } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

import { CasesByState, RkiData, Settings as SettingsModel, Summary } from '../model/model'
import { createDateFromTimestamp, firestore } from '../services/firebase'
import Themeprovider from './Provider/Themeprovider'
import Settings from './Settings/Settings'

interface TooltipProps {
    active: boolean
    payload: { color: string; value: any; payload: RkiData }[]
}

const useStyles = makeStyles(theme =>
    createStyles({
        app: {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
            userSelect: 'none',
        },
        backgroundAmber: {
            backgroundColor: amber.A400,
        },
        backgroundTeal: {
            backgroundColor: teal.A400,
        },
        backgroundRed: {
            backgroundColor: red.A400,
        },
        colorBlack: {
            color: '#000',
        },
        paperSummary: {
            padding: theme.spacing(1),
            justifyContent: 'space-evenly',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: theme.shadows[4],
            [theme.breakpoints.between('xs', 'md')]: {
                minWidth: 120,
                minHeight: 60,
            },
            [theme.breakpoints.up('lg')]: {
                minWidth: 160,
                minHeight: 80,
            },
        },
        itemSummary: {
            position: 'sticky',
            top: 'calc(env(safe-area-inset-top) + 12px)',
            zIndex: theme.zIndex.appBar,
        },
        containerSummary: {
            [theme.breakpoints.between('xs', 'md')]: {
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                overflowX: 'auto',
            },
        },
    })
)

const App = () => {
    const [casesByState, setCasesByState] = useState<CasesByState>(new Map())
    const [summary, setSummary] = useState<Summary | null>(null)
    const [settings, setSettings] = useState<SettingsModel>({
        log: false,
        showAxis: false,
        showLegend: false,
    })

    const classes = useStyles()

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
                .limit(16)
                .onSnapshot(snapshot => {
                    const docs = snapshot.docs.map(doc => ({ ...doc.data() } as RkiData))

                    setSummary({
                        lastUpdate: createDateFromTimestamp(docs[0].timestamp),
                        cases: docs.reduce((acc, doc) => (acc += doc.cases), 0),
                        rate: docs.reduce((acc, doc) => (acc += doc.rate), 0) / docs.length,
                        deaths: docs.reduce((acc, doc) => (acc += doc.deaths), 0),
                    })
                }),
        []
    )

    return (
        <div className={classes.app}>
            <Themeprovider>
                <Container maxWidth="xl">
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.itemSummary}>
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                className={classes.containerSummary}>
                                <Grid item>
                                    <Paper className={classes.paperSummary}>
                                        <Calendar />
                                        {summary ? (
                                            <Typography variant="h6">
                                                {' '}
                                                {summary.lastUpdate.toLocaleDateString()}
                                            </Typography>
                                        ) : (
                                            <Skeleton variant="text" width="70%" />
                                        )}
                                    </Paper>
                                </Grid>

                                <Grid item>
                                    <Paper
                                        className={clsx(
                                            classes.paperSummary,
                                            classes.backgroundAmber
                                        )}>
                                        <Sigma className={classes.colorBlack} />
                                        {summary ? (
                                            <Typography className={classes.colorBlack} variant="h6">
                                                {summary.cases}
                                            </Typography>
                                        ) : (
                                            <Skeleton variant="text" width="70%" />
                                        )}
                                    </Paper>
                                </Grid>

                                <Grid item>
                                    <Paper
                                        className={clsx(
                                            classes.paperSummary,
                                            classes.backgroundTeal
                                        )}>
                                        <Percent className={classes.colorBlack} />
                                        {summary ? (
                                            <Typography className={classes.colorBlack} variant="h6">
                                                {summary.rate}
                                            </Typography>
                                        ) : (
                                            <Skeleton variant="text" width="70%" />
                                        )}
                                    </Paper>
                                </Grid>

                                <Grid item>
                                    <Paper
                                        className={clsx(
                                            classes.paperSummary,
                                            classes.backgroundRed
                                        )}>
                                        <Skull />
                                        {summary ? (
                                            <Typography variant="h6">{summary.deaths}</Typography>
                                        ) : (
                                            <Skeleton variant="text" width="70%" />
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                        {[...casesByState.entries()].map(([state, data]) => (
                            <Grid item xs={12} sm={6} lg={4} xl={3} key={state}>
                                <Card elevation={4}>
                                    <CardHeader title={state} />
                                    <CardContent>
                                        <ResponsiveContainer
                                            height="100%"
                                            width="100%"
                                            aspect={16 / 9}>
                                            <LineChart data={data}>
                                                <Tooltip
                                                    content={({
                                                        payload,
                                                        active,
                                                    }: TooltipProps) => (
                                                        <>
                                                            {active && (
                                                                <Card elevation={8}>
                                                                    <CardHeader
                                                                        title={
                                                                            <>
                                                                                {createDateFromTimestamp(
                                                                                    payload[0]
                                                                                        .payload
                                                                                        .timestamp
                                                                                ).toLocaleDateString()}
                                                                            </>
                                                                        }
                                                                        subheader={
                                                                            payload[0].payload.delta
                                                                        }
                                                                    />
                                                                    <Divider variant="middle" />
                                                                    <Box padding={2}>
                                                                        <Grid
                                                                            container
                                                                            wrap="nowrap"
                                                                            spacing={2}>
                                                                            <Grid item>
                                                                                <Chip
                                                                                    className={clsx(
                                                                                        classes.backgroundAmber,
                                                                                        classes.colorBlack
                                                                                    )}
                                                                                    icon={
                                                                                        <Sigma
                                                                                            className={
                                                                                                classes.colorBlack
                                                                                            }
                                                                                        />
                                                                                    }
                                                                                    label={
                                                                                        payload[0]
                                                                                            .value
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <Chip
                                                                                    className={clsx(
                                                                                        classes.backgroundTeal,
                                                                                        classes.colorBlack
                                                                                    )}
                                                                                    icon={
                                                                                        <Percent
                                                                                            className={
                                                                                                classes.colorBlack
                                                                                            }
                                                                                        />
                                                                                    }
                                                                                    label={
                                                                                        payload[1]
                                                                                            .value
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <Chip
                                                                                    className={
                                                                                        classes.backgroundRed
                                                                                    }
                                                                                    icon={<Skull />}
                                                                                    label={
                                                                                        payload[2]
                                                                                            .value
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Box>
                                                                </Card>
                                                            )}
                                                        </>
                                                    )}
                                                />

                                                <YAxis
                                                    hide={!settings.showAxis}
                                                    yAxisId="left"
                                                    scale={settings.log ? scaleSymlog() : 'auto'}
                                                    orientation="left"
                                                />
                                                <YAxis
                                                    hide={!settings.showAxis}
                                                    yAxisId="right"
                                                    scale={settings.log ? scaleSymlog() : 'auto'}
                                                    orientation="right"
                                                />

                                                <Line
                                                    yAxisId="left"
                                                    type="monotone"
                                                    stroke={amber.A400}
                                                    strokeWidth={3}
                                                    dataKey="cases"
                                                />
                                                <Line
                                                    yAxisId={'right'}
                                                    type="monotone"
                                                    stroke={teal.A400}
                                                    strokeWidth={3}
                                                    dataKey="rate"
                                                />
                                                <Line
                                                    yAxisId={'right'}
                                                    type="monotone"
                                                    stroke={red.A400}
                                                    strokeWidth={3}
                                                    dataKey="deaths"
                                                />

                                                {settings.showLegend && (
                                                    <Legend
                                                        verticalAlign="top"
                                                        formatter={(
                                                            value: 'cases' | 'rate' | 'deaths'
                                                        ) =>
                                                            value === 'cases'
                                                                ? 'Anzahl'
                                                                : value === 'rate'
                                                                ? 'Fälle / 100 000'
                                                                : 'Todesfälle'
                                                        }
                                                    />
                                                )}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}

                        {casesByState.size === 0 &&
                            new Array(16).fill(1).map((_dummy, index) => (
                                <Grid item xs={12} sm={6} lg={4} key={index}>
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

                <Settings {...settings} onChange={setSettings} />
            </Themeprovider>
        </div>
    )
}

export default App
