import { Card, CardContent, CardHeader, Grid, GridSize } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { useMemo } from 'react'

import { useConfigContext } from '../Provider/ConfigProvider'
import EsriProvider from '../Provider/EsriProvider'
import { useFirestoreContext } from '../Provider/FirestoreProvider'
import Chart from './Chart/Chart'

interface Props {
    maxAxisDomain: number | undefined
}

const Charts = ({ maxAxisDomain }: Props) => {
    const { config } = useConfigContext()
    const { firestoreData } = useFirestoreContext()

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

    return (
        <Grid container spacing={2}>
            <EsriProvider>
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
                                                recovered.timestamp
                                                    .toDate()
                                                    .toLocaleDateString() ===
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
            </EsriProvider>

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
