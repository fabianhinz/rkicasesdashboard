import { Chip, ChipProps, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

type StyleProps = Pick<Props, 'backgroundColor'>

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            backgroundColor: ({ backgroundColor }: StyleProps) => backgroundColor,
        },
        icon: {
            color: ({ backgroundColor }: StyleProps) =>
                theme.palette.getContrastText(backgroundColor),
        },
        label: {
            color: ({ backgroundColor }: StyleProps) =>
                theme.palette.getContrastText(backgroundColor),
        },
    })
)

interface Props extends Omit<ChipProps, 'classes'> {
    backgroundColor: string
}

const StateTooltipChip = ({ backgroundColor, ...chipProps }: Props) => {
    const classes = useStyles({ backgroundColor })

    return <Chip classes={classes} {...chipProps} />
}

export default StateTooltipChip
