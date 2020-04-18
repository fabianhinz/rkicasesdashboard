import { createStyles, Grid, makeStyles } from '@material-ui/core'
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

import { VisibleCharts } from '../../model/model'
import db from '../../services/db'
import { useConfigContext } from '../Provider/ConfigProvider'
import SummaryPaper from './SummaryPaper'

const useStyles = makeStyles(theme =>
    createStyles({
        summary: {
            [theme.breakpoints.up('md')]: {
                position: 'sticky',
                top: 'calc(env(safe-area-inset-top) + 16px)',
                zIndex: theme.zIndex.appBar,
            },
            marginBottom: theme.spacing(2),
            overflowX: 'auto',
        },
    })
)

const Summary = () => {
    const { config, configDispatch } = useConfigContext()

    const classes = useStyles()

    const handleSummaryClick = (key: keyof VisibleCharts) => () => {
        const visibleCharts = { ...config.visibleCharts, [key]: !config.visibleCharts[key] }

        configDispatch({ type: 'visibleChartsChange', visibleCharts })
        db.data.put(visibleCharts, 'visibleCharts')
    }

    return (
        <Grid container spacing={2} wrap="nowrap" className={classes.summary}>
            <Grid item>
                <SummaryPaper
                    dataKey="cases"
                    onClick={handleSummaryClick('cases')}
                    backgroundColor={amber.A400}
                    icon={<Sigma />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    dataKey="doublingRate"
                    onClick={handleSummaryClick('doublingRate')}
                    backgroundColor={orange.A400}
                    icon={<CalendarRange />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    dataKey="delta"
                    onClick={handleSummaryClick('delta')}
                    backgroundColor={lime.A400}
                    icon={<ChartTimelineVariant />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    dataKey="rate"
                    onClick={handleSummaryClick('rate')}
                    backgroundColor={cyan.A400}
                    icon={<AccountMultiple />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    dataKey="recovered"
                    onClick={handleSummaryClick('recovered')}
                    backgroundColor={green.A400}
                    icon={<HandHeart />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    dataKey="deaths"
                    onClick={handleSummaryClick('deaths')}
                    backgroundColor={red.A400}
                    icon={<Skull />}
                />
            </Grid>
        </Grid>
    )
}

export default Summary
