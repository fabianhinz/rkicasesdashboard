import { Card, CardContent, CardHeader } from '@material-ui/core'
import { amber, lime, orange, red, teal } from '@material-ui/core/colors'
import { scaleSymlog } from 'd3-scale'
import React, { useMemo, useState } from 'react'
import {
    Area,
    AxisDomain,
    Bar,
    ComposedChart,
    Line,
    LineProps,
    ResponsiveContainer,
    Tooltip,
    YAxis,
} from 'recharts'

import { StateData } from '../../model/model'
import { useConfigContext } from '../Provider/Configprovider'
import BarShape, { BarShapeProps } from './BarShape'
import ChartTooltip, { TooltipProps } from './ChartTooltip'

interface Props {
    title: string
    data: StateData[]
    maxAxisDomain?: number
}

const Chart = ({ data, title, maxAxisDomain }: Props) => {
    const { config } = useConfigContext()

    const [activeLabel, setActiveLabel] = useState<number | undefined>()

    const sharedLineProps: Partial<LineProps> = useMemo(
        () => ({ dot: false, type: 'monotone', strokeWidth: 3, activeDot: { r: 6 } }),
        []
    )

    const domain: Readonly<[AxisDomain, AxisDomain]> | undefined = useMemo(
        () =>
            maxAxisDomain
                ? config.settings.normalize
                    ? [0, maxAxisDomain]
                    : undefined
                : undefined,
        [maxAxisDomain, config.settings.normalize]
    )

    const handleActiveLabel = (type: 'change' | 'reset') => (event: any) => {
        setActiveLabel(type === 'change' ? event?.activeLabel : undefined)
    }

    return (
        <Card>
            <CardHeader title={title} />
            <CardContent>
                <ResponsiveContainer width="100%" aspect={config.settings.ratio}>
                    <ComposedChart
                        onMouseMove={handleActiveLabel('change')}
                        onMouseLeave={handleActiveLabel('reset')}
                        margin={{ bottom: 8, top: 8 }}
                        syncId={config.settings.syncTooltip ? 'syncedTooltipChart' : undefined}
                        data={data}>
                        <Tooltip
                            allowEscapeViewBox={{ x: false, y: false }}
                            position={{ x: ('auto' as unknown) as number, y: 0 }}
                            cursor={false}
                            animationEasing="ease-out"
                            content={({ payload }: TooltipProps) => (
                                <ChartTooltip
                                    visibleCharts={config.visibleCharts}
                                    payload={payload}
                                />
                            )}
                        />

                        <YAxis
                            type="number"
                            domain={domain}
                            hide={
                                !config.settings.showAxis ||
                                !Object.keys(config.visibleCharts)
                                    .map(key => config.visibleCharts[key])
                                    .some(Boolean)
                            }
                            scale={config.settings.log ? scaleSymlog() : 'auto'}
                        />

                        <Area
                            hide={!config.visibleCharts.rate}
                            stroke={teal.A400}
                            fill={teal.A400}
                            dataKey="rate"
                            {...sharedLineProps}
                        />

                        <Bar
                            barSize={15}
                            hide={!config.visibleCharts.doublingRate}
                            stroke={orange.A400}
                            dataKey="doublingRate"
                            fill={orange.A400}
                            shape={props => (
                                <BarShape {...({ ...props, activeLabel } as BarShapeProps)} />
                            )}
                        />

                        <Line
                            hide={!config.visibleCharts.delta}
                            stroke={lime.A400}
                            dataKey="delta"
                            {...sharedLineProps}
                        />

                        <Line
                            hide={!config.visibleCharts.cases}
                            stroke={amber.A400}
                            dataKey="cases"
                            {...sharedLineProps}
                        />

                        <Line
                            hide={!config.visibleCharts.deaths}
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
