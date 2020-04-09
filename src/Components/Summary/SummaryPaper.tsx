import {
    Avatar,
    ButtonBase,
    createStyles,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { useMemo } from 'react'

import { Summary } from '../../model/model'
import { useConfigContext } from '../Provider/Configprovider'
import { useDataContext } from '../Provider/Dataprovider'

type StyleProps = Pick<Props, 'backgroundColor'> & {
    visible: boolean
    legend?: string
    percentage: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            boxShadow: theme.shadows[4],
            height: ({ legend, percentage }: StyleProps) =>
                legend && percentage ? 120 : percentage ? 85 : legend ? 110 : 72,
            width: 160,
            transition: theme.transitions.create('all', {
                easing: theme.transitions.easing.easeOut,
            }),
            backgroundColor: ({ backgroundColor, visible }: StyleProps) =>
                visible ? backgroundColor : theme.palette.background.paper,
            color: ({ backgroundColor, visible }: StyleProps) =>
                visible ? theme.palette.getContrastText(backgroundColor) : 'inherit',
        },
        avatar: {
            backgroundColor: ({ backgroundColor, visible }: StyleProps) =>
                visible ? backgroundColor : theme.palette.background.paper,
            color: ({ backgroundColor, visible }: StyleProps) =>
                visible ? theme.palette.getContrastText(backgroundColor) : 'inherit',
            filter: 'brightness(80%)',
        },
        buttonBase: {
            borderRadius: 20,
        },
    })
)

interface Props {
    dataKey: keyof Omit<Summary, 'lastUpdate'>
    onClick: () => void
    icon: JSX.Element
    backgroundColor: string
}

const SummaryPaper = ({ dataKey, onClick, icon, backgroundColor }: Props) => {
    const { config } = useConfigContext()
    const { data } = useDataContext()

    const legend = useMemo(() => {
        if (!config.settings.showLegend) return undefined
        switch (dataKey) {
            case 'cases':
                return 'Fälle'
            case 'delta':
                return 'Differenz zum Vortag'
            case 'rate':
                return 'Fälle pro 100 000 Einwohner'
            case 'deaths':
                return 'Todesfälle'
            case 'doublingRate':
                return 'Verdopplungszeit in Tagen'
        }
    }, [config.settings.showLegend, dataKey])

    const classes = useStyles({
        backgroundColor,
        visible: config.visibleCharts[dataKey],
        percentage: config.settings.percentage,
        legend,
    })

    if (!data.summary || !data.summaryPercent)
        return <Skeleton variant="text" width="100%" height={39} />

    return (
        <ButtonBase className={classes.buttonBase} onClick={onClick}>
            <Paper className={classes.paper}>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={5}>
                        <Avatar className={classes.avatar}>{icon}</Avatar>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography align="left" variant="h6">
                            {Number.isInteger(data.summary[dataKey])
                                ? data.summary[dataKey]
                                : data.summary[dataKey].toFixed(1)}
                        </Typography>
                        {config.settings.percentage && (
                            <Typography align="left" component="div" variant="caption">
                                {data.summaryPercent[dataKey]}
                            </Typography>
                        )}
                    </Grid>

                    {legend && (
                        <Grid item xs={12}>
                            {' '}
                            <Typography variant="caption">{legend}</Typography>{' '}
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </ButtonBase>
    )
}

export default SummaryPaper
