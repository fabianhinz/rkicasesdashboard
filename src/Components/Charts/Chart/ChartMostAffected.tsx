import {
    Avatar,
    createStyles,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Paper,
    Slide,
    TextField,
} from '@material-ui/core'
import { cyan } from '@material-ui/core/colors'
import { AccountMultiple } from 'mdi-material-ui'
import React, { memo, useState } from 'react'

import { County } from '../../../model/model'

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            zIndex: 1,
            padding: 16,
            willChange: 'transform',
            width: 280,
        },
        textField: { width: '100%', marginBottom: 10 },
        avatar: {
            backgroundColor: cyan.A400,
            color: '#000',
        },
    })
)

interface Props {
    open: boolean
    counties?: County[]
}

const ChartMostAffected = ({ counties, open }: Props) => {
    const [filterValue, setFilterValue] = useState('')

    const classes = useStyles()

    return (
        <Slide direction="left" mountOnEnter unmountOnExit in={open}>
            <Paper className={classes.paper}>
                <TextField
                    autoFocus
                    className={classes.textField}
                    label="Filtern"
                    value={filterValue}
                    onChange={e => setFilterValue(e.target.value.toLowerCase())}
                />
                <List dense disablePadding>
                    {counties
                        ?.filter(data => data.county.toLowerCase().includes(filterValue))
                        .map((data, index) => (
                            <ListItem disableGutters key={index}>
                                <ListItemIcon>
                                    <Avatar className={classes.avatar}>
                                        <AccountMultiple />
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary={data.county} secondary={data.rate} />
                            </ListItem>
                        ))}
                </List>
            </Paper>
        </Slide>
    )
}

export default memo(
    ChartMostAffected,
    (prev, next) => prev.open === next.open && prev.counties === next.counties
)
