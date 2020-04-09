import { Box, Card, CardHeader, createStyles, Divider, Grid, makeStyles } from '@material-ui/core'
import { amber, cyan, lime, orange, red } from '@material-ui/core/colors'
import { AccountMultiple, CalendarRange, ChartTimelineVariant, Sigma, Skull } from 'mdi-material-ui'
import React, { ReactText } from 'react'

import { RkiData, VisibleCharts } from '../../model/model'
import ChartTooltipChip from './ChartTooltipChip'

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            width: 200,
        },
    })
)

export interface TooltipProps {
    payload?: {
        value: ReactText
        payload: RkiData
        dataKey: Partial<keyof RkiData> | 'doublingRate'
    }[]
    visibleCharts: VisibleCharts
}

const ChartTooltip = ({ payload, visibleCharts }: TooltipProps) => {
    const classes = useStyles()

    const values = {
        delta: payload?.find(data => data.dataKey === 'delta')?.value,
        cases: payload?.find(data => data.dataKey === 'cases')?.value,
        doublingRate: payload?.find(data => data.dataKey === 'doublingRate')?.value,
        rate: payload?.find(data => data.dataKey === 'rate')?.value,
        deaths: payload?.find(data => data.dataKey === 'deaths')?.value,
    }

    const title =
        payload && payload.length > 0
            ? payload[0].payload.timestamp.toDate().toLocaleDateString()
            : undefined

    return (
        <Card elevation={4} className={classes.card}>
            <CardHeader title={title} />
            <Divider variant="middle" />
            <Box padding={2}>
                <Grid container direction="column" spacing={1}>
                    {visibleCharts.cases && (
                        <Grid item>
                            <ChartTooltipChip
                                backgroundColor={amber.A400}
                                icon={<Sigma />}
                                label={values.cases}
                            />
                        </Grid>
                    )}

                    {visibleCharts.doublingRate && (
                        <Grid item>
                            <ChartTooltipChip
                                backgroundColor={orange.A400}
                                icon={<CalendarRange />}
                                label={values.doublingRate}
                            />
                        </Grid>
                    )}

                    {visibleCharts.delta && (
                        <Grid item>
                            <ChartTooltipChip
                                backgroundColor={lime.A400}
                                icon={<ChartTimelineVariant />}
                                label={values.delta}
                            />
                        </Grid>
                    )}

                    {visibleCharts.rate && (
                        <Grid item>
                            <ChartTooltipChip
                                backgroundColor={cyan.A400}
                                icon={<AccountMultiple />}
                                label={values.rate}
                            />
                        </Grid>
                    )}

                    {visibleCharts.deaths && (
                        <Grid item>
                            <ChartTooltipChip
                                backgroundColor={red.A400}
                                icon={<Skull />}
                                label={values.deaths}
                            />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Card>
    )
}

export default ChartTooltip
