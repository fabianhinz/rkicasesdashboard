import { createStyles, Grid, makeStyles, Slide } from '@material-ui/core'
import { amber, cyan, lime, orange, red } from '@material-ui/core/colors'
import { AccountMultiple, CalendarRange, ChartTimelineVariant, Sigma, Skull } from 'mdi-material-ui'
import React from 'react'

import { StateData, VisibleCharts } from '../../../model/model'
import ChartSelectionChip from './ChartSelectionChip'

const useStyles = makeStyles(() =>
    createStyles({
        chartSelection: {
            padding: 4,
        },
    })
)

interface Props {
    activeLabel: number | undefined
    data: StateData[]
    visibleCharts: VisibleCharts
}

const ChartSelection = ({ activeLabel, data, visibleCharts }: Props) => {
    const classes = useStyles()

    if (!activeLabel) return <></>

    return (
        <div className={classes.chartSelection}>
            <Slide direction="up" in>
                <Grid container spacing={1}>
                    {visibleCharts.cases && (
                        <Grid item>
                            <ChartSelectionChip
                                backgroundColor={amber.A400}
                                icon={<Sigma />}
                                label={data[activeLabel].cases}
                            />
                        </Grid>
                    )}

                    {visibleCharts.doublingRate && (
                        <Grid item>
                            <ChartSelectionChip
                                backgroundColor={orange.A400}
                                icon={<CalendarRange />}
                                label={data[activeLabel].doublingRate}
                            />
                        </Grid>
                    )}

                    {visibleCharts.delta && (
                        <Grid item>
                            <ChartSelectionChip
                                backgroundColor={lime.A400}
                                icon={<ChartTimelineVariant />}
                                label={data[activeLabel].delta}
                            />
                        </Grid>
                    )}

                    {visibleCharts.rate && (
                        <Grid item>
                            <ChartSelectionChip
                                backgroundColor={cyan.A400}
                                icon={<AccountMultiple />}
                                label={data[activeLabel].rate}
                            />
                        </Grid>
                    )}

                    {visibleCharts.deaths && (
                        <Grid item>
                            <ChartSelectionChip
                                backgroundColor={red.A400}
                                icon={<Skull />}
                                label={data[activeLabel].deaths}
                            />
                        </Grid>
                    )}
                </Grid>
            </Slide>
        </div>
    )
}

export default ChartSelection
