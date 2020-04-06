import { createStyles, makeStyles } from '@material-ui/core'
import React, { memo } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        path: {
            fill: ({ selected }: Pick<Props, 'selected'>) =>
                selected ? theme.palette.primary.dark : 'inherit',
        },
    })
)

interface Props extends React.SVGProps<SVGPathElement> {
    selected: boolean
}

const State = ({ selected, name, ...svgProps }: Props) => {
    const classes = useStyles({ selected })

    return <path {...svgProps} className={classes.path} />
}

export default memo(State, (prev, next) => prev.selected === next.selected)
