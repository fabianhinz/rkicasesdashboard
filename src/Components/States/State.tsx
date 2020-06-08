import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { useConfigContext } from '../Provider/ConfigProvider'

interface StyleProps {
    selected: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        path: {
            transition: theme.transitions.create('fill'),
            fill: ({ selected }: StyleProps) => (selected ? theme.palette.primary.dark : 'inherit'),
        },
    })
)

interface Props extends Omit<React.SVGProps<SVGPathElement>, 'name'> {
    // ? name of the state
    name: string
}

const State = ({ name, ...svgProps }: Props) => {
    const { config } = useConfigContext()

    const selected = config.enabledStates.has(name)
    const classes = useStyles({ selected })

    return (
        <path {...svgProps} className={classes.path}>
            <text>test</text>
        </path>
    )
}

export default State
