import { ButtonBase, createStyles, makeStyles, Paper, Typography } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { ReactText } from 'react'

type StyleProps = Pick<Props, 'backgroundColor' | 'selected' | 'legend'>

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            boxShadow: ({ selected }: StyleProps) =>
                selected ? theme.shadows[4] : theme.shadows[1],
            height: ({ legend }: StyleProps) => (legend ? 110 : 90),
            width: 160,
            transition: theme.transitions.create('all', {
                easing: theme.transitions.easing.easeOut,
            }),
            backgroundColor: ({ backgroundColor, selected }: StyleProps) =>
                selected ? backgroundColor : theme.palette.background.paper,
            color: ({ backgroundColor, selected }: StyleProps) =>
                selected ? theme.palette.getContrastText(backgroundColor) : 'inherit',
        },
        buttonBase: {
            borderRadius: 20,
        },
    })
)

interface Props {
    value?: ReactText
    legend?: string
    onClick: () => void
    selected: boolean
    icon: JSX.Element
    backgroundColor: string
}

const SummaryPaper = ({ onClick, legend, value, icon, selected, backgroundColor }: Props) => {
    const classes = useStyles({ backgroundColor, selected, legend })

    return (
        <ButtonBase className={classes.buttonBase} onClick={onClick}>
            <Paper className={classes.paper}>
                {icon}
                {value ? (
                    <Typography gutterBottom variant="h6">
                        {value}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width="100%" height={39} />
                )}

                {legend && <Typography variant="caption">{legend}</Typography>}
            </Paper>
        </ButtonBase>
    )
}

export default SummaryPaper
