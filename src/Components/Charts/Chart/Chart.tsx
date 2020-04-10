import { Card, CardHeader, createStyles, IconButton, makeStyles } from '@material-ui/core'
import { amber, cyan, lime, orange, red } from '@material-ui/core/colors'
import { scaleSymlog } from 'd3-scale'
import { HomeGroup } from 'mdi-material-ui'
import React, { useState } from 'react'
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

import { ActiveLabelProps, County, StateData } from '../../../model/model'
import { useConfigContext } from '../../Provider/Configprovider'
import BarShape, { BarShapeProps } from './BarShape'
import ChartMostAffected from './ChartMostAffected'
import ChartSelection from './ChartSelection'

const useStyles = makeStyles(theme =>
    createStyles({
        responsiveContainer: {
            padding: theme.spacing(2),
        },

        card: { position: 'relative' },
        mostAffectedToggle: { zIndex: 2 },
    })
)

interface Props extends ActiveLabelProps {
    title: string
    data: StateData[]
    maxAxisDomain?: number
    mostAffectedByState: Map<string, County[]>
}

const Chart = ({
    data,
    title,
    maxAxisDomain,
    activeLabel,
    setActiveLabel,
    mostAffectedByState,
}: Props) => {
    const [mostAffectedOpen, setMostAffectedOpen] = useState(false)

    const classes = useStyles()

    const { config } = useConfigContext()

    const domain: Readonly<[AxisDomain, AxisDomain]> | undefined = maxAxisDomain
        ? config.settings.normalize
            ? [0, maxAxisDomain]
            : undefined
        : undefined

    const sharedLineProps: Partial<LineProps> = {
        dot: false,
        type: 'monotone',
        strokeWidth: 3,
        activeDot: { r: 5 },
    }

    return (
        <Card className={classes.card}>
            <CardHeader
                title={title}
                action={
                    <IconButton
                        className={classes.mostAffectedToggle}
                        disabled={!mostAffectedByState}
                        onClick={() => setMostAffectedOpen(prev => !prev)}>
                        <HomeGroup />
                    </IconButton>
                }
            />
            <ChartSelection
                activeLabel={activeLabel}
                data={data}
                visibleCharts={config.visibleCharts}
            />
            <div className={classes.responsiveContainer}>
                <ResponsiveContainer width="100%" aspect={config.settings.ratio}>
                    <ComposedChart
                        margin={{ top: 8, bottom: 8 }}
                        syncId="sync"
                        onMouseMove={e => {
                            if (e?.activeLabel >= 0) setActiveLabel(e?.activeLabel)
                        }}
                        data={data}>
                        <Tooltip label={0} cursor={false} content={<></>} />

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
            </div>
            <ChartMostAffected
                open={Boolean(mostAffectedOpen && mostAffectedByState)}
                counties={
                    title !== 'Deutschland'
                        ? mostAffectedByState.get(title)!
                        : Array.from(mostAffectedByState?.values()).flat()
                }
            />
        </Card>
    )
}

export default Chart
