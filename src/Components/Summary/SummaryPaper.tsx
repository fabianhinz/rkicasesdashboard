import { ButtonBase, createStyles, makeStyles, Paper, Typography } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import React, { ReactText } from 'react'

type StyleProps = Pick<Props, 'backgroundColor' | 'selected'>

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            boxShadow: ({ selected }: StyleProps) =>
                selected ? theme.shadows[4] : theme.shadows[1],
            minHeight: 90,
            minWidth: 160,
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
    onClick: () => void
    selected: boolean
    icon: JSX.Element
    backgroundColor: string
}

const SummaryPaper = ({ onClick, value, icon, selected, backgroundColor }: Props) => {
    const classes = useStyles({ backgroundColor, selected })

    return (
        <ButtonBase className={classes.buttonBase} onClick={onClick}>
            <Paper className={classes.paper}>
                {icon}

                {value ? (
                    <Typography variant="h6">{value}</Typography>
                ) : (
                    <Skeleton variant="text" width="100%" height={30} />
                )}
            </Paper>
        </ButtonBase>
    )
}

export default SummaryPaper
