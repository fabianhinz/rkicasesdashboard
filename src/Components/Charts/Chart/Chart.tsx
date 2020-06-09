import { Card, CardHeader, createStyles, makeStyles, Portal } from '@material-ui/core'
import { amber, cyan, green, lime, orange, red } from '@material-ui/core/colors'
import { Skeleton } from '@material-ui/lab'
import { scaleSymlog } from 'd3-scale'
import React, { useEffect, useRef, useState } from 'react'
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

const useStyles = makeStyles(theme =>
    createStyles({
        responsiveContainer: {
            padding: theme.spacing(2),
        },
        card: { position: 'relative', height: '100%' },
    })
)

interface Props {
    state?: string
    data: CombinedStateData[]
    maxAxisDomain?: number
}

const Chart = (props: Props) => {
    const [debouncing, setDebouncing] = useState(true)

    const { config } = useConfigContext()

    useEffect(() => {
        setDebouncing(true)
        const timeout = setTimeout(() => setDebouncing(false), 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [props, config])

    const chartSelectionContainer = useRef(null)
    const classes = useStyles()

    const domain: Readonly<[AxisDomain, AxisDomain]> | undefined = props.maxAxisDomain
        ? config.settings.normalize
            ? [0, props.maxAxisDomain]
            : undefined
        : undefined

    const sharedLineProps: Partial<LineProps> = {
        dot: false,
        type: 'monotone',
        strokeWidth: 3,
        activeDot: { r: 5 },
    }

    if (debouncing)
        return (
            <Card className={classes.card}>
                <Skeleton variant="rect" animation="wave" width="100%" height={400} />
            </Card>
        )

    return (
        <Card className={classes.card}>
            <CardHeader title={props.state || 'Deutschland'} />

            <div ref={chartSelectionContainer} />

            <div className={classes.responsiveContainer}>
                <ResponsiveContainer width="100%" aspect={config.settings.ratio}>
                    <ComposedChart margin={{ top: 16, bottom: 16 }} data={props.data}>
                        <Tooltip
                            content={(tooltipProps: any) => (
                                <Portal container={chartSelectionContainer.current}>
                                    <ChartSelection
                                        activeLabel={
                                            tooltipProps.active
                                                ? tooltipProps.label
                                                : props.data.length - 1
                                        }
                                        data={props.data}
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

                        <Bar
                            hide={!config.visibleCharts.recovered}
                            stroke={green.A400}
                            dataKey="recovered"
                            fill={green.A400}
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
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

export default Chart
