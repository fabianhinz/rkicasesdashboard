import { LinearProgress, makeStyles, Typography } from '@material-ui/core'
import React, { ReactText } from 'react'

const useStyles = makeStyles(theme => ({
    loadingContainer: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    linearProgress: {
        height: 14,
        borderRadius: 6,
        [theme.breakpoints.between('xs', 'md')]: {
            width: 320,
        },
        [theme.breakpoints.up('lg')]: {
            width: 640,
        },
    },
}))

interface Props {
    label: ReactText
    value?: number
}

const Loading = ({ label, value }: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.loadingContainer}>
            <Typography gutterBottom variant="h4" align="center">
                {label}...
            </Typography>
            <LinearProgress
                variant={value ? 'determinate' : 'indeterminate'}
                value={value}
                color="secondary"
                className={classes.linearProgress}
            />
        </div>
    )
}

export default Loading
