import {
    Card,
    CardHeader,
    createStyles,
    IconButton,
    makeStyles,
    Tooltip as MuiTooltip,
} from '@material-ui/core'
import { amber, cyan, green, lime, orange, red } from '@material-ui/core/colors'
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

import { ActiveLabelProps, CombinedStateData } from '../../../model/model'
import EsriMostAffected from '../../Esri/EsriMostAffected'
import { useConfigContext } from '../../Provider/ConfigProvider'
import { useEsriContext } from '../../Provider/EsriProvider'
import ChartBarShape, { ChartBarShapeProps } from './ChartBarShape'
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
    state?: string
    data: CombinedStateData[]
    maxAxisDomain?: number
}

const Chart = ({ data, maxAxisDomain, activeLabel, setActiveLabel, state }: Props) => {
    const { esriData } = useEsriContext()
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
                title={state || 'Deutschland'}
                action={
                    <MuiTooltip placement="left" title="Land- und Stadtkreise">
                        <IconButton
                            className={classes.mostAffectedToggle}
                            onClick={() => setMostAffectedOpen(prev => !prev)}>
                            <HomeGroup />
                        </IconButton>
                    </MuiTooltip>
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
                        <Tooltip cursor={false} content={<></>} />

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
                            shape={props => (
                                <ChartBarShape
                                    {...({ ...props, activeLabel } as ChartBarShapeProps)}
                                />
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
            <EsriMostAffected
                open={mostAffectedOpen}
                county={state}
                showSkeletons={esriData.loading}
            />
        </Card>
    )
}

export default Chart
