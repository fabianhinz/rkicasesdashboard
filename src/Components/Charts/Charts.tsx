import { Card, CardContent, CardHeader, Grid, GridSize } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { useMemo, useState } from 'react'

import { useConfigContext } from '../Provider/Configprovider'
import { useDataContext } from '../Provider/Dataprovider'
import Chart from './Chart/Chart'

interface Props {
    maxAxisDomain: number | undefined
}

const Charts = ({ maxAxisDomain }: Props) => {
    const [activeLabel, setActiveLabel] = useState<number | undefined>()
    const { config } = useConfigContext()
    const { data } = useDataContext()

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
            {config.enabledStates.size === 0 && (
                <Grid item xs={12}>
                    <Chart
                        title="Deutschland"
                        data={[...data.byDay.values()]}
                        activeLabel={activeLabel}
                        setActiveLabel={setActiveLabel}
                    />
                </Grid>
            )}

            {[...data.byState.entries()]
                .filter(([state]) => config.enabledStates.has(state))
                .map(([state, data]) => (
                    <Grid item {...gridBreakpointProps} key={state}>
                        <Chart
                            title={state}
                            data={data}
                            maxAxisDomain={maxAxisDomain}
                            activeLabel={activeLabel}
                            setActiveLabel={setActiveLabel}
                        />
                    </Grid>
                ))}

            {data.byState.size === 0 &&
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
