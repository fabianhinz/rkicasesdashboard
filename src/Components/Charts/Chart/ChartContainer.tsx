import { Portal } from '@material-ui/core'
import { amber, cyan, green, lime, orange, red, yellow } from '@material-ui/core/colors'
import { scaleSymlog } from 'd3-scale'
import React, { useMemo, useRef } from 'react'
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

import { CombinedStateData } from '../../../model/model'
import { useConfigContext } from '../../Provider/ConfigProvider'
import ChartSelection from './ChartSelection'

interface Props {
    data: CombinedStateData[]
    maxAxisDomain?: number
}

const ChartContainer = (props: Props) => {
    const chartSelectionContainer = useRef(null)
    const { config } = useConfigContext()

    const domain: Readonly<[AxisDomain, AxisDomain]> | undefined = useMemo(
        () =>
            props.maxAxisDomain
                ? config.settings.normalize
                    ? [0, props.maxAxisDomain]
                    : [0, 'dataMax']
                : undefined,
        [config.settings.normalize, props.maxAxisDomain]
    )

    const sharedLineProps: Partial<LineProps> = useMemo(
        () => ({
            dot: false,
            type: 'monotone',
            strokeWidth: 5,
            activeDot: { r: 7 },
        }),
        []
    )

    const data = useMemo(
        () =>
            props.data
                .map(component => {
                    const dataObj: Partial<CombinedStateData> = {}
                    Object.keys(config.visibleCharts).forEach(key => {
                        if (config.visibleCharts[key] && component[key]) {
                            dataObj.timestamp = component.timestamp
                            dataObj[key] = component[key]
                        }
                    })
                    return dataObj
                })
                .filter(component => Object.keys(component).length > 0),
        [config.visibleCharts, props.data]
    )

    return (
        <>
            <div ref={chartSelectionContainer} />
            <ResponsiveContainer width="100%" aspect={config.settings.ratio}>
                <ComposedChart
                    syncId="chart"
                    margin={{ top: 16, bottom: 16, right: 16, left: 16 }}
                    data={data}>
                    <Tooltip
                        content={(tooltipProps: any) => (
                            <Portal container={chartSelectionContainer.current}>
                                <ChartSelection
                                    data={
                                        data[
                                            tooltipProps.active
                                                ? tooltipProps.label
                                                : data.length - 1
                                        ]
                                    }
                                    visibleCharts={config.visibleCharts}
                                />
                            </Portal>
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
                        stroke={cyan.A400}
                        fill={cyan.A400}
                        dataKey="rate"
                        {...sharedLineProps}
                    />

                    <Area
                        hide={!config.visibleCharts.recovered}
                        stroke={green.A400}
                        dataKey="recovered"
                        fill={green.A400}
                        {...sharedLineProps}
                    />

                    <Bar
                        hide={!config.visibleCharts.doublingRate}
                        stroke={orange.A400}
                        dataKey="doublingRate"
                        fill={orange.A400}
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

                    <Line
                        hide={!config.visibleCharts.activeCases}
                        stroke={yellow.A400}
                        dataKey="activeCases"
                        {...sharedLineProps}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </>
    )
}

export default ChartContainer
