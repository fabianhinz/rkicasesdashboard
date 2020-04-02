import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { ReactComponent as BackgroundIcon } from '../icons/germany.svg'

const useStyles = makeStyles(theme =>
    createStyles({
        backgroundIcon: {
            position: 'fixed',
            zIndex: -1,
            bottom: theme.spacing(4),
            left: 0,
            height: '95vh',
            opacity: theme.palette.type === 'dark' ? 0.05 : 0.1,
        },
    })
)

const Background = () => {
    const classes = useStyles()

    return <BackgroundIcon className={classes.backgroundIcon} />
}

export default Background
