import {
    Avatar,
    Backdrop,
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
import { Skeleton } from '@material-ui/lab'
import { AccountMultiple } from 'mdi-material-ui'
import React, { memo, useState } from 'react'

import { County } from '../../../model/model'

const useStyles = makeStyles(theme =>
    createStyles({
        backdrop: {
            zIndex: 1,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            borderRadius: 20,
        },
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
    counties?: (County & { name?: string })[]
    showSkeletons: boolean
}

const ChartMostAffected = ({ counties, open, showSkeletons }: Props) => {
    const [filterValue, setFilterValue] = useState('')

    const classes = useStyles()

    return (
        <>
            <Backdrop open={open} className={classes.backdrop} />
            <Slide direction="left" mountOnEnter unmountOnExit in={open}>
                <Paper className={classes.paper}>
                    <TextField
                        className={classes.textField}
                        label="Filtern"
                        value={filterValue}
                        onChange={e => setFilterValue(e.target.value.toLowerCase())}
                        helperText={
                            showSkeletons
                                ? undefined
                                : `${new Date().toLocaleDateString()} Fälle pro 100 000 Einwohner`
                        }
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
                                    <ListItemText
                                        primary={`${data.county}: ${data.rate}`}
                                        secondary={data.name}
                                    />
                                </ListItem>
                            ))}
                        {showSkeletons &&
                            new Array(30).fill(1).map((_dummy, index) => (
                                <ListItem disableGutters key={index}>
                                    <ListItemIcon>
                                        <Skeleton width={40} height={40} variant="circle" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Skeleton variant="text" width="80%" />}
                                        secondary={<Skeleton variant="text" width="30%" />}
                                    />
                                </ListItem>
                            ))}
                    </List>
                </Paper>
            </Slide>
        </>
    )
}

export default memo(
    ChartMostAffected,
    (prev, next) =>
        prev.open === next.open &&
        prev.counties === next.counties &&
        prev.showSkeletons === next.showSkeletons
)
