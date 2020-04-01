import { createStyles, Grid, makeStyles } from '@material-ui/core'
import { amber, lime, red, teal } from '@material-ui/core/colors'
import { AccountMultiple, ChartTimelineVariant, Sigma, Skull } from 'mdi-material-ui'
import React from 'react'

import { Summary as SummaryModel, VisibleCharts } from '../../model/model'
import db from '../../services/db'
import SummaryPaper from './SummaryPaper'

const useStyles = makeStyles(theme =>
    createStyles({
        containerSummary: {
            [theme.breakpoints.between('xs', 'md')]: {
                flexWrap: 'nowrap',
                overflowX: 'auto',
                justifyContent: 'flex-start',
            },
        },
    })
)

interface Props {
    visibleCharts: VisibleCharts
    summary: SummaryModel | null
    onVisibleChartsChange: React.Dispatch<
        React.SetStateAction<Record<'delta' | 'cases' | 'rate' | 'deaths', boolean>>
    >
}

const Summary = ({ onVisibleChartsChange, summary, visibleCharts }: Props) => {
    const classes = useStyles()

    const handleSummaryClick = (key: keyof VisibleCharts) => () => {
        const newVisibleCharts = { ...visibleCharts, [key]: !visibleCharts[key] }
        onVisibleChartsChange(newVisibleCharts)

        db.data.put(newVisibleCharts, 'visibleCharts')
    }

    return (
        <Grid container justify="center" spacing={2} className={classes.containerSummary}>
            <Grid item>
                <SummaryPaper
                    value={summary?.cases}
                    onClick={handleSummaryClick('cases')}
                    selected={visibleCharts.cases}
                    backgroundColor={amber.A400}
                    icon={<Sigma />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={summary?.delta}
                    onClick={handleSummaryClick('delta')}
                    selected={visibleCharts.delta}
                    backgroundColor={lime.A400}
                    icon={<ChartTimelineVariant />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={summary?.rate}
                    onClick={handleSummaryClick('rate')}
                    selected={visibleCharts.rate}
                    backgroundColor={teal.A400}
                    icon={<AccountMultiple />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={summary?.deaths}
                    onClick={handleSummaryClick('deaths')}
                    selected={visibleCharts.deaths}
                    backgroundColor={red.A400}
                    icon={<Skull />}
                />
            </Grid>
        </Grid>
    )
}

export default Summary
