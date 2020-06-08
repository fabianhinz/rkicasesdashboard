import {
    Avatar,
    ButtonBase,
    createStyles,
    Grid,
    Grow,
    makeStyles,
    Paper,
    Typography,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import clsx from 'clsx'
import React, { useMemo } from 'react'

import { LEGEND } from '../../constants'
import { Summary } from '../../model/model'
import { useConfigContext } from '../Provider/ConfigProvider'
import { useFirestoreContext } from '../Provider/FirestoreProvider'
import { useLayoutContext } from '../Provider/LayoutProvider'

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
            minWidth: 160,
            width: '100%',
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
            width: '100%',
        },
        legend: {
            maxWidth: 120,
            margin: 'auto',
            marginTop: theme.spacing(0.5),
            height: 38,
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

    const { layout } = useLayoutContext()

    const legend = useMemo(() => {
        if (!config.settings.showLegend) return undefined
        return LEGEND[dataKey]
    }, [config.settings.showLegend, dataKey])

    const classes = useStyles({
        backgroundColor,
        visible: config.visibleCharts[dataKey] || layout === 'mobile',
        percentage: config.settings.percentage,
        legend,
    })

    if (!firestoreData.summary || !firestoreData.summaryPercent)
        return <Skeleton variant="text" width="100%" height={39} />

    return (
        <ButtonBase disabled={layout === 'mobile'} className={classes.buttonBase} onClick={onClick}>
            <Paper className={classes.paper}>
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
                        <Grow in={config.settings.percentage} mountOnEnter unmountOnExit>
                            <Typography align="left" component="div" variant="caption">
                                {firestoreData.summaryPercent[dataKey]}
                            </Typography>
                        </Grow>
                    </Grid>
                </Grid>

                <Grow in={Boolean(legend)} mountOnEnter unmountOnExit>
                    <Typography
                        className={clsx(layout === 'desktop' && classes.legend)}
                        component="div"
                        align="center"
                        variant="caption">
                        {legend}
                    </Typography>
                </Grow>
            </Paper>
        </ButtonBase>
    )
}

export default SummaryPaper
