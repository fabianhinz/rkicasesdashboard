import { Grid, makeStyles, Typography } from '@material-ui/core'
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

const useStyles = makeStyles(theme => ({
    chartSelection: {
        padding: theme.spacing(2),
        paddingTop: 0,
    },
}))

interface Props {
    data: Partial<CombinedStateData> | undefined
    visibleCharts: VisibleCharts
}

const ChartSelection = ({ data, visibleCharts }: Props) => {
    const classes = useStyles()

    if (!data) return <></>

    return (
        <div className={classes.chartSelection}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography color="textSecondary" variant="subtitle2">
                        {data.timestamp?.toDate().toLocaleDateString()}
                    </Typography>
                </Grid>

                {visibleCharts.cases && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={amber.A400}
                            icon={<Sigma />}
                            label={data.cases}
                        />
                    </Grid>
                )}

                {visibleCharts.activeCases && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={yellow.A400}
                            icon={<MedicalBag />}
                            label={data.activeCases}
                        />
                    </Grid>
                )}

                {visibleCharts.rate && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={cyan.A400}
                            icon={<AccountMultiple />}
                            label={data.rate}
                        />
                    </Grid>
                )}

                {visibleCharts.delta && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={lime.A400}
                            icon={<ChartTimelineVariant />}
                            label={data.delta}
                        />
                    </Grid>
                )}

                {visibleCharts.doublingRate && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={orange.A400}
                            icon={<CalendarRange />}
                            label={data.doublingRate}
                        />
                    </Grid>
                )}

                {visibleCharts.recovered && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={green.A400}
                            icon={<HandHeart />}
                            label={data.recovered}
                        />
                    </Grid>
                )}

                {visibleCharts.deaths && (
                    <Grid item xs={6} sm={3} md="auto">
                        <ChartSelectionChip
                            backgroundColor={red.A400}
                            icon={<Skull />}
                            label={data.deaths}
                        />
                    </Grid>
                )}
            </Grid>
        </div>
    )
}

export default ChartSelection
