import { Chip, ChipProps, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

type StyleProps = Pick<Props, 'backgroundColor'>

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            backgroundColor: ({ backgroundColor }: StyleProps) => backgroundColor,
            width: '100%',
            justifyContent: 'flex-start',
        },
        icon: {
            color: ({ backgroundColor }: StyleProps) =>
                backgroundColor ? theme.palette.getContrastText(backgroundColor) : undefined,
        },
        label: {
            color: ({ backgroundColor }: StyleProps) =>
                backgroundColor ? theme.palette.getContrastText(backgroundColor) : undefined,
        },
    })
)

interface Props extends Omit<ChipProps, 'classes'> {
    backgroundColor?: string
}

const ChartSelectionChip = ({ backgroundColor, ...chipProps }: Props) => {
    const classes = useStyles({ backgroundColor })

    return (
        <Chip
            classes={classes}
            {...chipProps}
            label={
                typeof chipProps.label === 'number'
                    ? Math.trunc(chipProps.label)
                    : chipProps.label || 'unbekannt'
            }
        />
    )
}

export default ChartSelectionChip
