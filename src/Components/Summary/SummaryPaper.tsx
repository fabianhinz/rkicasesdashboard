import {
    Avatar,
    ButtonBase,
    createStyles,
    Divider,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { useMemo } from 'react'

import { Summary } from '../../model/model'
import { useConfigContext } from '../Provider/ConfigProvider'
import { useFirestoreContext } from '../Provider/FirestoreProvider'

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
                legend && percentage ? 130 : percentage ? 85 : legend ? 120 : 72,
            minWidth: 160,
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
        divider: {
            backgroundColor: ({ visible }: StyleProps) =>
                visible || theme.palette.type === 'light'
                    ? 'rgba(0, 0, 0, 0.12)'
                    : 'rgba(255, 255, 255, 0.12)',
        },
        legendItem: {
            width: 140,
        },
        dataItem: {
            maxHeight: 59,
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
    const { firestoreData } = useFirestoreContext()

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

    if (!firestoreData.summary || !firestoreData.summaryPercent)
        return <Skeleton variant="text" width="100%" height={39} />

    return (
        <ButtonBase className={classes.buttonBase} onClick={onClick}>
            <Paper className={classes.paper}>
                <Grid container direction="column" justify="center" spacing={1}>
                    <Grid item className={classes.dataItem}>
                        <Grid container alignItems="center" spacing={1} wrap="nowrap">
                            <Grid item>
                                <Avatar className={classes.avatar}>{icon}</Avatar>
                            </Grid>
                            <Grid item>
                                <Typography align="left" variant="h6">
                                    {Number.isInteger(firestoreData.summary[dataKey])
                                        ? firestoreData.summary[dataKey]
                                        : firestoreData.summary[dataKey].toFixed(1)}
                                </Typography>
                                {config.settings.percentage && (
                                    <Typography align="left" component="div" variant="caption">
                                        {firestoreData.summaryPercent[dataKey]}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>

                    {legend && (
                        <Grid item xs={12}>
                            <Grid
                                className={classes.legendItem}
                                container
                                justify="center"
                                spacing={1}>
                                <Grid item className={classes.legendItem}>
                                    <Divider className={classes.divider} />
                                </Grid>
                                <Grid item className={classes.legendItem}>
                                    <Typography variant="caption">{legend}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </ButtonBase>
    )
}

export default SummaryPaper
