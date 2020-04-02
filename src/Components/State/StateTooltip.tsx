import { Box, Card, CardHeader, createStyles, Divider, Grid, makeStyles } from '@material-ui/core'
import { amber, lime, red, teal } from '@material-ui/core/colors'
import { AccountMultiple, ChartTimelineVariant, Sigma, Skull } from 'mdi-material-ui'
import React, { ReactText } from 'react'

import { RkiData, VisibleCharts } from '../../model/model'
import StateTooltipChip from './StateTooltipChip'

const useStyles = makeStyles(() =>
    createStyles({
        card: {
            width: 200,
        },
    })
)

export interface TooltipProps {
    active: boolean
    payload?: {
        color: string
        value: ReactText
        payload: RkiData
        dataKey: Partial<keyof RkiData>
    }[]
    visibleCharts: VisibleCharts
}

const StateTooltip = ({ active, payload, visibleCharts }: TooltipProps) => {
    const classes = useStyles()

    if (!active || !payload || payload.length < 1) return <></>

    const values = {
        delta: payload.find(data => data.dataKey === 'delta')?.value,
        cases: payload.find(data => data.dataKey === 'cases')?.value,
        rate: payload.find(data => data.dataKey === 'rate')?.value,
        deaths: payload.find(data => data.dataKey === 'deaths')?.value,
    }

    return (
        <Card elevation={8} className={classes.card}>
            <CardHeader title={<>{payload[0].payload.timestamp.toDate().toLocaleDateString()}</>} />
            <Divider variant="middle" />
            <Box padding={2}>
                <Grid container spacing={1}>
                    {visibleCharts.cases && (
                        <Grid item xs={6} md={12}>
                            <StateTooltipChip
                                backgroundColor={amber.A400}
                                icon={<Sigma />}
                                label={values.cases}
                            />
                        </Grid>
                    )}

                    {visibleCharts.delta && (
                        <Grid item xs={6} md={12}>
                            <StateTooltipChip
                                backgroundColor={lime.A400}
                                icon={<ChartTimelineVariant />}
                                label={values.delta}
                            />
                        </Grid>
                    )}

                    {visibleCharts.rate && (
                        <Grid item xs={6} md={12}>
                            <StateTooltipChip
                                backgroundColor={teal.A400}
                                icon={<AccountMultiple />}
                                label={values.rate}
                            />
                        </Grid>
                    )}

                    {visibleCharts.deaths && (
                        <Grid item xs={6} md={12}>
                            <StateTooltipChip
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

export default StateTooltip
