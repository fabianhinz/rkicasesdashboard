import { createStyles, Grid, GridProps, makeStyles, Snackbar } from '@material-ui/core'
import { amber, cyan, green, lime, orange, red, yellow } from '@material-ui/core/colors'
import { Alert } from '@material-ui/lab'
import {
    AccountMultiple,
    CalendarRange,
    ChartTimelineVariant,
    HandHeart,
    MedicalBag,
    Sigma,
    Skull,
} from 'mdi-material-ui'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
    StateData,
    Summary as SummaryModel,
    SummaryPercent,
    VisibleCharts,
} from '../../model/model'
import db from '../../services/db'
import { percentageOf, summUp } from '../../services/utility'
import { useConfigContext } from '../Provider/ConfigProvider'
import { useFirestoreContext } from '../Provider/FirestoreProvider'
import { useLayoutContext } from '../Provider/LayoutProvider'
import SummaryPaper from './SummaryPaper'

const useStyles = makeStyles(theme =>
    createStyles({
        summary: {
            [theme.breakpoints.up('md')]: {
                position: 'sticky',
                top: 'calc(env(safe-area-inset-top) + 16px)',
                zIndex: theme.zIndex.appBar,
            },
            marginBottom: theme.spacing(2),
            overflowX: 'auto',
        },
        snackbar: {
            top: 0,
        },
        alert: {
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingTop: 'calc(env(safe-area-inset-top) + 6px)',
            boxShadow: theme.shadows[4],
        },
    })
)

export type SummaryChartData = Partial<Omit<SummaryModel, 'lastUpdate'>>

interface SummaryContextModel {
    summary: SummaryModel | null
    summaryPercent: SummaryPercent | null
    summaryChartData: SummaryChartData[]
}
const SummaryContext = React.createContext<SummaryContextModel | null>(null)
export const useSummaryContext = () => useContext(SummaryContext) as SummaryContextModel

const Summary = () => {
    const [summary, setSummary] = useState<SummaryModel | null>(null)
    const [summaryPercent, setSummaryPercent] = useState<SummaryPercent | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(true)
    const [summaryChartData, setSummaryChartData] = useState<SummaryChartData[]>([])

    const { config, configDispatch } = useConfigContext()
    const { firestoreData } = useFirestoreContext()

    const classes = useStyles()
    const { layout } = useLayoutContext()

    const getDoublingRates = useCallback(
        (from: 'today' | 'yesterday') =>
            summUp(
                Array.from(firestoreData.byState.entries())
                    .filter(
                        ([state]) =>
                            config.enabledStates.size === 0 || config.enabledStates.has(state)
                    )
                    .map(
                        ([_state, dayData]) =>
                            dayData[from === 'today' ? dayData.length - 1 : dayData.length - 2]
                    ),
                'doublingRate'
            ) / (config.enabledStates.size > 0 ? config.enabledStates.size : 16),
        [config.enabledStates, firestoreData.byState]
    )

    const recoveredToday = useMemo(
        () =>
            firestoreData.recoveredToday.filter(
                ({ state }) => config.enabledStates.size === 0 || config.enabledStates.has(state)
            ),
        [config.enabledStates, firestoreData.recoveredToday]
    )

    useEffect(() => {
        const today = firestoreData.today.filter(
            ({ state }) => config.enabledStates.size === 0 || config.enabledStates.has(state)
        )
        const cases = summUp(today, 'cases')
        const recovered = summUp(recoveredToday, 'recovered')

        setSummary({
            cases,
            recovered,
            deaths: summUp(today, 'deaths'),
            delta: summUp(today, 'delta'),
            rate:
                config.enabledStates.size === 16 || config.enabledStates.size === 0
                    ? // ? pupulation 83,02 Millionen (2019)
                      summUp(today, 'cases') / 830
                    : summUp(today, 'rate') / today.length,
            lastUpdate: today.reduce((acc, doc) => (acc = doc.timestamp.toDate()), new Date()),
            doublingRate: getDoublingRates('today'),
            activeCases: cases - recovered,
        })
    }, [
        config.enabledStates,
        firestoreData.byState,
        firestoreData.recoveredToday,
        firestoreData.today,
        getDoublingRates,
        recoveredToday,
    ])

    useEffect(() => {
        if (!summary) return

        const yesterday = firestoreData.yesterday.filter(
            ({ state }) => config.enabledStates.size === 0 || config.enabledStates.has(state)
        )
        const cases = percentageOf(summary.cases, summUp(yesterday, 'cases'))
        const recovered = percentageOf(
            summary.recovered,
            summary.recovered - summUp(recoveredToday, 'delta')
        )
        const activeCases = cases.value - recovered.value

        setSummaryPercent({
            cases: cases.formatted,
            deaths: percentageOf(summary.deaths, summUp(yesterday, 'deaths')).formatted,
            delta: percentageOf(summary.delta, summUp(yesterday, 'delta')).formatted,
            rate: percentageOf(summary.rate, summUp(yesterday, 'rate') / yesterday.length)
                .formatted,
            doublingRate: percentageOf(summary.doublingRate, getDoublingRates('yesterday'))
                .formatted,
            recovered: recovered.formatted,
            activeCases: `${activeCases > 0 ? '+' : ''}${activeCases.toFixed(2)} %`,
        })
    }, [config.enabledStates, firestoreData.yesterday, getDoublingRates, recoveredToday, summary])

    useEffect(() => {
        const lastThirtyDays = new Set<string>()
        const stateDataFlattened = Array.from(
            firestoreData.byState.entries(),
            ([state, stateData]) => {
                if (config.enabledStates.size === 0 || config.enabledStates.has(state)) {
                    const slicedData = stateData.slice(-14).map(v => {
                        const timestamp = v.timestamp.toDate().toLocaleDateString()

                        return {
                            ...v,
                            timestamp,
                            recovered: firestoreData.recoveredByState
                                .get(state)
                                ?.find(r => r.timestamp.toDate().toLocaleDateString() === timestamp)
                                ?.recovered,
                        }
                    })
                    slicedData.forEach(({ timestamp }) => lastThirtyDays.add(timestamp))
                    return slicedData
                } else return false
            }
        )
            .filter(Boolean)
            .flat() as (Omit<StateData, 'timestamp'> & { timestamp: string; recovered: number })[]

        const newSummaryChartData: SummaryChartData[] = []
        lastThirtyDays.forEach(day => {
            const dayData = stateDataFlattened.filter(({ timestamp }) => timestamp === day)

            const cases = summUp(dayData, 'cases')
            const recovered = summUp(dayData, 'recovered')
            newSummaryChartData.push({
                cases,
                recovered,
                deaths: summUp(dayData, 'deaths'),
                activeCases: cases - recovered,
                delta: summUp(dayData, 'delta'),
                doublingRate: summUp(dayData, 'doublingRate'),
                rate: summUp(dayData, 'rate'),
            })
        })
        setSummaryChartData(newSummaryChartData)
    }, [config.enabledStates, firestoreData.byState, firestoreData.recoveredByState])

    const handleSummaryClick = (key: keyof VisibleCharts) => () => {
        const visibleCharts = { ...config.visibleCharts, [key]: !config.visibleCharts[key] }

        configDispatch({ type: 'visibleChartsChange', visibleCharts })
        db.data.put(visibleCharts, 'visibleCharts')
    }

    const memoBreakpointProps: Pick<GridProps, 'xs' | 'sm'> | undefined = useMemo(
        () => (layout === 'desktop' ? undefined : { xs: 12 }),
        [layout]
    )

    return (
        <>
            <SummaryContext.Provider value={{ summary, summaryPercent, summaryChartData }}>
                <Grid
                    container
                    spacing={2}
                    wrap={layout === 'desktop' ? 'nowrap' : 'wrap'}
                    className={classes.summary}>
                    <Grid item {...memoBreakpointProps}>
                        <SummaryPaper
                            dataKey="cases"
                            onClick={handleSummaryClick('cases')}
                            backgroundColor={amber.A400}
                            icon={<Sigma />}
                        />
                    </Grid>

                    <Grid item {...memoBreakpointProps}>
                        <SummaryPaper
                            dataKey="activeCases"
                            onClick={handleSummaryClick('activeCases')}
                            backgroundColor={yellow.A400}
                            icon={<MedicalBag />}
                        />
                    </Grid>

                    <Grid item {...memoBreakpointProps}>
                        <SummaryPaper
                            dataKey="rate"
                            onClick={handleSummaryClick('rate')}
                            backgroundColor={cyan.A400}
                            icon={<AccountMultiple />}
                        />
                    </Grid>

                    <Grid item {...memoBreakpointProps}>
                        <SummaryPaper
                            dataKey="delta"
                            onClick={handleSummaryClick('delta')}
                            backgroundColor={lime.A400}
                            icon={<ChartTimelineVariant />}
                        />
                    </Grid>

                    <Grid item {...memoBreakpointProps}>
                        <SummaryPaper
                            dataKey="doublingRate"
                            onClick={handleSummaryClick('doublingRate')}
                            backgroundColor={orange.A400}
                            icon={<CalendarRange />}
                        />
                    </Grid>

                    <Grid item {...memoBreakpointProps}>
                        <SummaryPaper
                            dataKey="recovered"
                            onClick={handleSummaryClick('recovered')}
                            backgroundColor={green.A400}
                            icon={<HandHeart />}
                        />
                    </Grid>

                    <Grid item {...memoBreakpointProps}>
                        <SummaryPaper
                            dataKey="deaths"
                            onClick={handleSummaryClick('deaths')}
                            backgroundColor={red.A400}
                            icon={<Skull />}
                        />
                    </Grid>
                </Grid>
            </SummaryContext.Provider>

            {summary?.lastUpdate && (
                <Snackbar
                    classes={{ anchorOriginTopCenter: classes.snackbar }}
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={() => setSnackbarOpen(false)}>
                    <Alert
                        classes={{ standardInfo: classes.alert }}
                        severity="info"
                        onClose={() => setSnackbarOpen(false)}>
                        Zuletzt aktualisiert am {summary?.lastUpdate.toLocaleString()}
                    </Alert>
                </Snackbar>
            )}
        </>
    )
}

export default Summary
