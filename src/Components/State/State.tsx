import { Card, CardContent, CardHeader, Grid, GridSize } from '@material-ui/core'
import { amber, lime, red, teal } from '@material-ui/core/colors'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { scaleSymlog } from 'd3-scale'
import React from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

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
    if (enabledStates.size > 0 && !enabledStates.has(state)) return <></>

    return (
        <Grid item {...gridBreakpointProps} key={state}>
            <Card>
                <CardHeader title={state} />
                <CardContent>
                    <ResponsiveContainer height="100%" width="100%" aspect={21 / 9}>
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
                                orientation="left"
                            />

                            <Line
                                hide={!visibleCharts.delta}
                                type="monotone"
                                stroke={lime.A400}
                                strokeWidth={3}
                                dataKey="delta"
                            />
                            <Line
                                hide={!visibleCharts.cases}
                                type="monotone"
                                stroke={amber.A400}
                                strokeWidth={3}
                                dataKey="cases"
                            />
                            <Line
                                hide={!visibleCharts.rate}
                                type="monotone"
                                stroke={teal.A400}
                                strokeWidth={3}
                                dataKey="rate"
                            />
                            <Line
                                hide={!visibleCharts.deaths}
                                type="monotone"
                                stroke={red.A400}
                                strokeWidth={3}
                                dataKey="deaths"
                            />

                            {settings.showLegend && (
                                <Legend
                                    verticalAlign="top"
                                    formatter={(value: 'cases' | 'rate' | 'deaths' | 'delta') =>
                                        value === 'cases'
                                            ? 'Anzahl'
                                            : value === 'rate'
                                            ? 'Fälle / 100 000'
                                            : value === 'delta'
                                            ? 'Differenz zum Vortag'
                                            : 'Todesfälle'
                                    }
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default State
