import { createStyles, Divider, Grid, Grow, makeStyles } from '@material-ui/core'
import { amber, cyan, green, lime, orange, red } from '@material-ui/core/colors'
import {
    AccountMultiple,
    CalendarRange,
    ChartTimelineVariant,
    HandHeart,
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
                <Grid item>
                    <ChartSelectionChip
                        variant="outlined"
                        label={data[activeLabel].timestamp.toDate().toLocaleDateString()}
                    />
                </Grid>

                <Grid item>
                    <Divider orientation="vertical" />
                </Grid>

                <Grow mountOnEnter unmountOnExit in={visibleCharts.cases}>
                    <Grid item>
                        <ChartSelectionChip
                            backgroundColor={amber.A400}
                            icon={<Sigma />}
                            label={data[activeLabel].cases}
                        />
                    </Grid>
                </Grow>

                <Grow mountOnEnter unmountOnExit in={visibleCharts.doublingRate}>
                    <Grid item>
                        <ChartSelectionChip
                            backgroundColor={orange.A400}
                            icon={<CalendarRange />}
                            label={data[activeLabel].doublingRate}
                        />
                    </Grid>
                </Grow>

                <Grow mountOnEnter unmountOnExit in={visibleCharts.delta}>
                    <Grid item>
                        <ChartSelectionChip
                            backgroundColor={lime.A400}
                            icon={<ChartTimelineVariant />}
                            label={data[activeLabel].delta}
                        />
                    </Grid>
                </Grow>

                <Grow mountOnEnter unmountOnExit in={visibleCharts.rate}>
                    <Grid item>
                        <ChartSelectionChip
                            backgroundColor={cyan.A400}
                            icon={<AccountMultiple />}
                            label={data[activeLabel].rate}
                        />
                    </Grid>
                </Grow>

                <Grow mountOnEnter unmountOnExit in={visibleCharts.recovered}>
                    <Grid item>
                        <ChartSelectionChip
                            backgroundColor={green.A400}
                            icon={<HandHeart />}
                            label={data[activeLabel].recovered}
                        />
                    </Grid>
                </Grow>

                <Grow mountOnEnter unmountOnExit in={visibleCharts.deaths}>
                    <Grid item>
                        <ChartSelectionChip
                            backgroundColor={red.A400}
                            icon={<Skull />}
                            label={data[activeLabel].deaths}
                        />
                    </Grid>
                </Grow>
            </Grid>
        </div>
    )
}

export default ChartSelection
