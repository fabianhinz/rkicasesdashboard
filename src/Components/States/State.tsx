import { Chip, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import db from '../../services/db'
import { useConfigContext } from '../Provider/ConfigProvider'
import { useFirestoreContext } from '../Provider/FirestoreProvider'

interface StyleProps {
    selected: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        path: {
            cursor: 'pointer',
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
    const { config, configDispatch } = useConfigContext()
    const { firestoreData } = useFirestoreContext()

    const selected = config.enabledStates.has(name)
    const classes = useStyles({ selected })

    if (selected) console.log(firestoreData.byState.get(name))

    const handleClick = () => {
        const enabledStates = new Set(config.enabledStates)
        if (enabledStates.has(name)) enabledStates.delete(name)
        else enabledStates.add(name)

        db.data.put(enabledStates, 'enabledStates')
        configDispatch({ type: 'enabledStatesChange', enabledStates })
    }

    return (
        <path {...svgProps} onClick={handleClick} className={classes.path}>
            <text>test</text>
        </path>
    )
}

export default State
