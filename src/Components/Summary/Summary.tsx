import { createStyles, Grid, makeStyles } from '@material-ui/core'
import { amber, lime, orange, red, teal } from '@material-ui/core/colors'
import { AccountMultiple, CalendarRange, ChartTimelineVariant, Sigma, Skull } from 'mdi-material-ui'
import React from 'react'

import { VisibleCharts } from '../../model/model'
import db from '../../services/db'
import { useConfigContext } from '../Provider/Configprovider'
import SummaryPaper from './SummaryPaper'

const useStyles = makeStyles(theme =>
    createStyles({
        containerSummary: {
            '@media(max-width: 1240px)': {
                flexWrap: 'nowrap',
                overflowX: 'auto',
                justifyContent: 'flex-start',
            },
            '&::-webkit-scrollbar': {
                display: 'none',
            },
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
        <Grid container justify="center" spacing={2} className={classes.containerSummary}>
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
                    backgroundColor={teal.A400}
                    icon={<AccountMultiple />}
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
