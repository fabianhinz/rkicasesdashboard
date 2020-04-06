import { Card, CardContent, CardHeader, useMediaQuery } from '@material-ui/core'
import { amber, lime, red, teal } from '@material-ui/core/colors'
import { scaleSymlog } from 'd3-scale'
import React, { useMemo } from 'react'
import {
    Area,
    AxisDomain,
    ComposedChart,
    Line,
    LineProps,
    ResponsiveContainer,
    Tooltip,
    YAxis,
} from 'recharts'

import { Settings, StateData, VisibleCharts } from '../../model/model'
import ChartTooltip, { TooltipProps } from './ChartTooltip'

interface Props {
    settings: Settings
    title: string
    data: StateData[]
    visibleCharts: VisibleCharts
    maxAxisDomain?: number
}

const Chart = ({ settings, data, title, visibleCharts, maxAxisDomain }: Props) => {
    const mobileRes = useMediaQuery('(max-width: 425px)')

    const sharedLineProps: Partial<LineProps> = useMemo(
        () => ({ dot: false, type: 'monotone', strokeWidth: 3, activeDot: { r: 6 } }),
        []
    )

    const domain: Readonly<[AxisDomain, AxisDomain]> | undefined = useMemo(
        () => (maxAxisDomain ? (settings.normalize ? [0, maxAxisDomain] : undefined) : undefined),
        [maxAxisDomain, settings.normalize]
    )

    return (
        <Card>
            <CardHeader title={title} />
            <CardContent>
                <ResponsiveContainer width="100%" aspect={mobileRes ? 1 : 2}>
                    <ComposedChart
                        margin={{ bottom: 8, top: 8 }}
                        syncId={settings.syncTooltip ? 'syncedTooltipChart' : undefined}
                        data={data}>
                        <Tooltip
                            cursor={false}
                            animationEasing="ease-out"
                            content={({ payload }: TooltipProps) => (
                                <ChartTooltip visibleCharts={visibleCharts} payload={payload} />
                            )}
                        />

                        <YAxis
                            type="number"
                            domain={domain}
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

export default Chart
