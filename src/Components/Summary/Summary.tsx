import { createStyles, Grid, makeStyles } from '@material-ui/core'
import { amber, lime, red, teal } from '@material-ui/core/colors'
import { AccountMultiple, ChartTimelineVariant, Sigma, Skull } from 'mdi-material-ui'
import React, { useCallback } from 'react'

import { VisibleCharts } from '../../model/model'
import db from '../../services/db'
import { useConfigContext } from '../Provider/Configprovider'
import { useDataContext } from '../Provider/Dataprovider'
import SummaryPaper from './SummaryPaper'

const useStyles = makeStyles(theme =>
    createStyles({
        containerSummary: {
            '@media(max-width: 1100px)': {
                flexWrap: 'nowrap',
                overflowX: 'auto',
                justifyContent: 'flex-start',
            },
        },
    })
)

const Summary = () => {
    const { config, configDispatch } = useConfigContext()
    const { data } = useDataContext()

    const classes = useStyles()

    const handleSummaryClick = (key: keyof VisibleCharts) => () => {
        const visibleCharts = { ...config.visibleCharts, [key]: !config.visibleCharts[key] }

        // ? one chart should always be visible
        if (
            Object.keys(visibleCharts)
                .map(key => visibleCharts[key])
                .filter(Boolean).length === 0
        )
            return

        configDispatch({ type: 'visibleChartsChange', visibleCharts })
        db.data.put(visibleCharts, 'visibleCharts')
    }

    const legendOrUndefined = useCallback(
        (legend: string) => (config.settings.showLegend ? legend : undefined),
        [config.settings.showLegend]
    )

    return (
        <Grid container justify="center" spacing={2} className={classes.containerSummary}>
            <Grid item>
                <SummaryPaper
                    value={data.summary?.cases}
                    onClick={handleSummaryClick('cases')}
                    selected={config.visibleCharts.cases}
                    backgroundColor={amber.A400}
                    legend={legendOrUndefined('Fälle')}
                    icon={<Sigma />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={data.summary?.delta}
                    onClick={handleSummaryClick('delta')}
                    selected={config.visibleCharts.delta}
                    backgroundColor={lime.A400}
                    legend={legendOrUndefined('Differenz zum Vortag')}
                    icon={<ChartTimelineVariant />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={data.summary?.rate}
                    onClick={handleSummaryClick('rate')}
                    selected={config.visibleCharts.rate}
                    backgroundColor={teal.A400}
                    legend={legendOrUndefined('Fälle / 100 000')}
                    icon={<AccountMultiple />}
                />
            </Grid>

            <Grid item>
                <SummaryPaper
                    value={data.summary?.deaths}
                    onClick={handleSummaryClick('deaths')}
                    selected={config.visibleCharts.deaths}
                    backgroundColor={red.A400}
                    legend={legendOrUndefined('Todesfälle')}
                    icon={<Skull />}
                />
            </Grid>
        </Grid>
    )
}

export default Summary
