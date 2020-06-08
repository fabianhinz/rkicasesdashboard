import { Card, CardContent, CardHeader, Grid, GridSize } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { useEffect, useMemo, useState } from 'react'

import { useConfigContext } from '../Provider/ConfigProvider'
import { useFirestoreContext } from '../Provider/FirestoreProvider'
import { useLayoutContext } from '../Provider/LayoutProvider'
import Loading from '../Shared/Loading'
import Chart from './Chart/Chart'

interface Props {
    maxAxisDomain: number | undefined
}

let progressIntervall: NodeJS.Timeout

const Charts = ({ maxAxisDomain }: Props) => {
    const { config } = useConfigContext()
    const { firestoreData } = useFirestoreContext()
    const [showChart, setShowChart] = useState(false)
    const [showChartProgress, setShowChartProgress] = useState(10)

    const { layout } = useLayoutContext()

    useEffect(() => {
        setShowChart(false)
        setShowChartProgress(10)

        const ms = Math.max(config.enabledStates.size * 150, 500)

        const timeout = setTimeout(() => setShowChart(true), ms)
        progressIntervall = setInterval(() => setShowChartProgress(prev => prev + 10), ms / 10)

        return () => {
            clearTimeout(timeout)
            clearInterval(progressIntervall)
        }
    }, [config.enabledStates, config.visibleCharts, maxAxisDomain])

    useEffect(() => {
        if (showChartProgress === 100) clearInterval(progressIntervall)
    }, [showChartProgress])

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

    if (layout === 'mobile') return <></>
    if (!showChart) return <Loading value={showChartProgress} label="Dashboard wird gebaut" />

    return (
        <Grid container spacing={2}>
            {config.enabledStates.size === 0 && (
                <Grid item xs={12}>
                    <Chart
                        data={[...firestoreData.byDay.entries()].map(([localdate, byDay]) => ({
                            ...byDay,
                            recovered: firestoreData.recoveredByDay.get(localdate)?.recovered,
                        }))}
                    />
                </Grid>
            )}

            {[...firestoreData.byState.entries()]
                .filter(([state]) => config.enabledStates.has(state))
                .map(([state, stateData]) => (
                    <Grid item {...gridBreakpointProps} key={state}>
                        <Chart
                            state={state}
                            data={stateData.map(data => {
                                const stateRecoveredData = firestoreData.recoveredByState
                                    .get(state)
                                    ?.find(
                                        recovered =>
                                            recovered.timestamp.toDate().toLocaleDateString() ===
                                            data.timestamp.toDate().toLocaleDateString()
                                    )

                                return {
                                    ...data,
                                    recovered: stateRecoveredData?.recovered,
                                }
                            })}
                            maxAxisDomain={maxAxisDomain}
                        />
                    </Grid>
                ))}

            {firestoreData.byState.size === 0 &&
                new Array(config.enabledStates.size).fill(1).map((_dummy, index) => (
                    <Grid item {...gridBreakpointProps} key={index}>
                        <Card>
                            <CardHeader title={<Skeleton variant="text" width="60%" />} />
                            <CardContent>
                                <Skeleton variant="rect" width="100%" height={350} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
        </Grid>
    )
}

export default Charts
