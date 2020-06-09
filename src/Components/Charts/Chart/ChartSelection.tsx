import { createStyles, Grid, makeStyles, Typography } from '@material-ui/core'
import { amber, cyan, green, lime, orange, red, yellow } from '@material-ui/core/colors'
import {
    AccountMultiple,
    CalendarRange,
    ChartTimelineVariant,
    HandHeart,
    MedicalBag,
    Sigma,
    Skull,
} from 'mdi-material-ui'
import React from 'react'

import { CombinedStateData, VisibleCharts } from '../../../model/model'
import ChartSelectionChip from './ChartSelectionChip'

const useStyles = makeStyles(theme =>
    createStyles({
        chartSelection: {
            padding: theme.spacing(2),
            paddingTop: 0,
        },
    })
)

interface Props {
    activeLabel: number
    data: CombinedStateData[]
    visibleCharts: VisibleCharts
}

const ChartSelection = ({ activeLabel, data, visibleCharts }: Props) => {
    const classes = useStyles()

    if (activeLabel < 0) return <></>

    return (
        <div className={classes.chartSelection}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography color="textSecondary" variant="subtitle2">
                        {data[activeLabel].timestamp.toDate().toLocaleDateString()}
                    </Typography>
                </Grid>

                {visibleCharts.cases && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={amber.A400}
                            icon={<Sigma />}
                            label={data[activeLabel].cases}
                        />
                    </Grid>
                )}

                {visibleCharts.activeCases && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={yellow.A400}
                            icon={<MedicalBag />}
                            label={data[activeLabel].activeCases}
                        />
                    </Grid>
                )}

                {visibleCharts.rate && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={cyan.A400}
                            icon={<AccountMultiple />}
                            label={data[activeLabel].rate}
                        />
                    </Grid>
                )}

                {visibleCharts.delta && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={lime.A400}
                            icon={<ChartTimelineVariant />}
                            label={data[activeLabel].delta}
                        />
                    </Grid>
                )}

                {visibleCharts.doublingRate && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={orange.A400}
                            icon={<CalendarRange />}
                            label={data[activeLabel].doublingRate}
                        />
                    </Grid>
                )}

                {visibleCharts.recovered && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={green.A400}
                            icon={<HandHeart />}
                            label={data[activeLabel].recovered}
                        />
                    </Grid>
                )}

                {visibleCharts.deaths && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={red.A400}
                            icon={<Skull />}
                            label={data[activeLabel].deaths}
                        />
                    </Grid>
                )}
            </Grid>
        </div>
    )
}

export default ChartSelection
