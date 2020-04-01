import { createStyles, Grid, makeStyles } from '@material-ui/core'
import { amber, lime, red, teal } from '@material-ui/core/colors'
import { AccountMultiple, ChartTimelineVariant, Sigma, Skull } from 'mdi-material-ui'
import React, { useCallback } from 'react'

import { Settings, Summary as SummaryModel, VisibleCharts } from '../../model/model'
import db from '../../services/db'
import SummaryPaper from './SummaryPaper'

const useStyles = makeStyles(theme =>
    createStyles({
        containerSummary: {
            [theme.breakpoints.between('xs', 'sm')]: {
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
    settings: Settings
    onVisibleChartsChange: React.Dispatch<
        React.SetStateAction<Record<'delta' | 'cases' | 'rate' | 'deaths', boolean>>
    >
}

const Summary = ({ onVisibleChartsChange, summary, visibleCharts, settings }: Props) => {
    const classes = useStyles()

    const handleSummaryClick = (key: keyof VisibleCharts) => () => {
        const newVisibleCharts = { ...visibleCharts, [key]: !visibleCharts[key] }

        // ? one chart should always be visible
        if (
            Object.keys(newVisibleCharts)
                .map(key => newVisibleCharts[key])
                .filter(Boolean).length === 0
        )
            return

        onVisibleChartsChange(newVisibleCharts)
        db.data.put(newVisibleCharts, 'visibleCharts')
    }

    const legendOrUndefined = useCallback(
        (legend: string) => (settings.showLegend ? legend : undefined),
        [settings.showLegend]
    )

    return (
        <Grid container justify="center" spacing={2} className={classes.containerSummary}>
            <Grid item>
                <SummaryPaper
                    value={summary?.cases}
                    onClick={handleSummaryClick('cases')}
                    selected={visibleCharts.cases}
                    backgroundColor={amber.A400}
                    legend={legendOrUndefined('Fälle')}
                    icon={<Sigma />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={summary?.delta}
                    onClick={handleSummaryClick('delta')}
                    selected={visibleCharts.delta}
                    backgroundColor={lime.A400}
                    legend={legendOrUndefined('Differenz zum Vortag')}
                    icon={<ChartTimelineVariant />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={summary?.rate}
                    onClick={handleSummaryClick('rate')}
                    selected={visibleCharts.rate}
                    backgroundColor={teal.A400}
                    legend={legendOrUndefined('Fälle / 100 000')}
                    icon={<AccountMultiple />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={summary?.deaths}
                    onClick={handleSummaryClick('deaths')}
                    selected={visibleCharts.deaths}
                    backgroundColor={red.A400}
                    legend={legendOrUndefined('Todesfälle')}
                    icon={<Skull />}
                />
            </Grid>
        </Grid>
    )
}

export default Summary
