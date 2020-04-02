import { Card, CardContent, CardHeader } from '@material-ui/core'
import { amber, lime, red, teal } from '@material-ui/core/colors'
import { scaleSymlog } from 'd3-scale'
import React, { useMemo } from 'react'
import { Area, ComposedChart, Line, LineProps, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

import { Settings, StateData, VisibleCharts } from '../../model/model'
import StateTooltip, { TooltipProps } from './StateTooltip'

interface Props {
    settings: Settings
    title: string
    data: StateData[]
    visibleCharts: VisibleCharts
}

const State = ({ settings, data, title, visibleCharts }: Props) => {
    const sharedLineProps: Partial<LineProps> = useMemo(
        () => ({ dot: false, type: 'monotone', strokeWidth: 3 }),
        []
    )

    return (
        <Card>
            <CardHeader title={title} />
            <CardContent>
                <ResponsiveContainer width="100%" aspect={2}>
                    <ComposedChart data={data}>
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

                        <Area
                            hide={!visibleCharts.rate}
                            stroke={teal.A400}
                            fill={teal.A400}
                            dataKey="rate"
                            {...sharedLineProps}
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
                            hide={!visibleCharts.deaths}
                            stroke={red.A400}
                            dataKey="deaths"
                            {...sharedLineProps}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default State
