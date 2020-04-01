import { Card, CardContent, CardHeader, Grid, GridSize, useMediaQuery } from '@material-ui/core'
import { amber, lime, red, teal } from '@material-ui/core/colors'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { scaleSymlog } from 'd3-scale'
import React, { useMemo } from 'react'
import { Line, LineChart, LineProps, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

import { Settings, State as StateModel, StateData, VisibleCharts } from '../../model/model'
import StateTooltip, { TooltipProps } from './StateTooltip'

interface Props {
    settings: Settings
    enabledStates: Set<string>
    state: StateModel
    data: StateData
    gridBreakpointProps: Partial<Record<Breakpoint, boolean | GridSize>>
    visibleCharts: VisibleCharts
}

const State = ({
    enabledStates,
    settings,
    data,
    state,
    gridBreakpointProps,
    visibleCharts,
}: Props) => {
    const lowRes = useMediaQuery('(max-width: 768px)')

    const sharedLineProps: Partial<LineProps> = useMemo(
        () => ({ dot: false, type: 'monotone', strokeWidth: 3 }),
        []
    )

    if (enabledStates.size > 0 && !enabledStates.has(state)) return <></>

    return (
        <Grid item {...gridBreakpointProps} key={state}>
            <Card>
                <CardHeader title={state} />
                <CardContent>
                    <ResponsiveContainer width="100%" aspect={lowRes ? 2 : 3}>
                        <LineChart data={data}>
                            <Tooltip
                                content={({ payload, active }: TooltipProps) => (
                                    <StateTooltip
                                        visibleCharts={visibleCharts}
                                        payload={payload}
                                        active={active}
                                    />
                                )}
                            />

                            <YAxis
                                hide={!settings.showAxis}
                                scale={settings.log ? scaleSymlog() : 'auto'}
                            />

                            <Line
                                hide={!visibleCharts.delta}
                                stroke={lime.A400}
                                dataKey="delta"
                                {...sharedLineProps}
                            />
                            <Line
                                hide={!visibleCharts.cases}
                                stroke={amber.A400}
                                dataKey="cases"
                                {...sharedLineProps}
                            />
                            <Line
                                hide={!visibleCharts.rate}
                                stroke={teal.A400}
                                dataKey="rate"
                                {...sharedLineProps}
                            />
                            <Line
                                hide={!visibleCharts.deaths}
                                stroke={red.A400}
                                dataKey="deaths"
                                {...sharedLineProps}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default State
