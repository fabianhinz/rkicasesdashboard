import { Card, CardContent, CardHeader } from '@material-ui/core'
import { amber, cyan, lime, orange, red } from '@material-ui/core/colors'
import { scaleSymlog } from 'd3-scale'
import React, { useMemo } from 'react'
import {
    Area,
    AxisDomain,
    Bar,
    ComposedChart,
    Line,
    LineProps,
    ResponsiveContainer,
    YAxis,
} from 'recharts'

import { StateData } from '../../../model/model'
import { useConfigContext } from '../../Provider/Configprovider'
import BarShape, { BarShapeProps } from './BarShape'
import ChartSelection from './ChartSelection'

interface Props {
    title: string
    data: StateData[]
    maxAxisDomain?: number
    activeLabel?: number
    setActiveLabel: React.Dispatch<React.SetStateAction<number | undefined>>
}

const Chart = ({ data, title, maxAxisDomain, activeLabel, setActiveLabel }: Props) => {
    const { config } = useConfigContext()

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

    const memoChartSelection = useMemo(
        () => (
            <ChartSelection
                activeLabel={activeLabel}
                data={data}
                visibleCharts={config.visibleCharts}
            />
        ),
        [activeLabel, config.visibleCharts, data]
    )

    return (
        <Card>
            <CardHeader title={title} />
            <CardContent>
                <ResponsiveContainer width="100%" aspect={config.settings.ratio}>
                    <ComposedChart
                        onMouseMove={handleActiveLabel('change')}
                        onMouseLeave={handleActiveLabel('reset')}
                        margin={{ bottom: 8, top: 8 }}
                        data={data}>
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
                            stroke={cyan.A400}
                            fill={cyan.A400}
                            dataKey="rate"
                            {...sharedLineProps}
                        />

                        <Bar
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
                {memoChartSelection}
            </CardContent>
        </Card>
    )
}

export default Chart
