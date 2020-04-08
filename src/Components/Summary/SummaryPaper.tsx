import { ButtonBase, createStyles, makeStyles, Paper, Typography } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { useMemo } from 'react'

import { Summary } from '../../model/model'
import { useConfigContext } from '../Provider/Configprovider'
import { useDataContext } from '../Provider/Dataprovider'

type StyleProps = Pick<Props, 'backgroundColor'> & { visible: boolean; legend?: string }

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            boxShadow: theme.shadows[4],
            height: ({ legend }: StyleProps) => (legend ? 130 : 90),
            width: 160,
            transition: theme.transitions.create('all', {
                easing: theme.transitions.easing.easeOut,
            }),
            backgroundColor: ({ backgroundColor, visible }: StyleProps) =>
                visible ? backgroundColor : theme.palette.background.paper,
            color: ({ backgroundColor, visible }: StyleProps) =>
                visible ? theme.palette.getContrastText(backgroundColor) : 'inherit',
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
        legend,
    })

    if (!data.summary) return <Skeleton variant="text" width="100%" height={39} />

    return (
        <ButtonBase className={classes.buttonBase} onClick={onClick}>
            <Paper className={classes.paper}>
                {icon}

                <Typography gutterBottom variant="h6">
                    {typeof data.summary[dataKey] === 'number'
                        ? Math.trunc(data.summary[dataKey])
                        : data.summary[dataKey]}
                </Typography>

                {legend && <Typography variant="caption">{legend}</Typography>}
            </Paper>
        </ButtonBase>
    )
}

export default SummaryPaper
