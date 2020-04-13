import {
    Avatar,
    Backdrop,
    Checkbox,
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Paper,
    Slide,
    TextField,
} from '@material-ui/core'
import { cyan } from '@material-ui/core/colors'
import { Skeleton } from '@material-ui/lab'
import { AccountMultiple, Heart, HeartOutline } from 'mdi-material-ui'
import React, { useCallback, useState } from 'react'

import { County } from '../../../model/model'
import db from '../../../services/db'
import { useConfigContext } from '../../Provider/ConfigProvider'

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
            padding: theme.spacing(2),
            willChange: 'transform',
            width: 280,
            [theme.breakpoints.only('sm')]: {
                width: 320,
            },
            [theme.breakpoints.up('md')]: {
                width: 375,
            },
        },
        textField: {
            width: '100%',
            marginBottom: 10,
        },
        avatar: {
            backgroundColor: cyan.A400,
            color: '#000',
        },
        divider: {
            margin: '8px -16px 8px -16px',
        },
    })
)

type CountyWithName = County & { name?: string }

interface Props {
    open: boolean
    counties?: CountyWithName[]
    showSkeletons: boolean
}

const ChartMostAffected = ({ counties, open, showSkeletons }: Props) => {
    const [filterValue, setFilterValue] = useState('')

    const { config, configDispatch } = useConfigContext()

    const classes = useStyles()

    const handleFavoriteCountiesChange = useCallback(
        (county: string) => () => {
            const { favoriteCounties } = config
            if (favoriteCounties.has(county)) favoriteCounties.delete(county)
            else favoriteCounties.add(county)

            db.data.put(favoriteCounties, 'favoriteCounties')
            configDispatch({ type: 'favoriteCountiesChange', favoriteCounties })
        },
        [config, configDispatch]
    )

    const listItemRenderer = useCallback(
        (data: CountyWithName, index: number) => (
            <ListItem disableGutters key={index}>
                <ListItemIcon>
                    <Avatar className={classes.avatar}>
                        <AccountMultiple />
                    </Avatar>
                </ListItemIcon>
                <ListItemText primary={`${data.county}: ${data.rate}`} secondary={data.name} />
                <ListItemSecondaryAction>
                    <Checkbox
                        checked={config.favoriteCounties.has(data.county)}
                        onChange={handleFavoriteCountiesChange(data.county)}
                        color="primary"
                        icon={<HeartOutline />}
                        checkedIcon={<Heart />}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        ),
        [classes.avatar, config.favoriteCounties, handleFavoriteCountiesChange]
    )

    const includesFilterValue = (data: CountyWithName) =>
        data.county.toLowerCase().includes(filterValue)

    const favoriteCounties = (strategy: 'include' | 'skip') => (data: CountyWithName) =>
        strategy === 'include'
            ? config.favoriteCounties.has(data.county)
            : !config.favoriteCounties.has(data.county)

    return (
        <>
            <Backdrop open={open} className={classes.backdrop} />
            <Slide direction="left" mountOnEnter unmountOnExit in={open}>
                <Paper className={classes.paper}>
                    <TextField
                        className={classes.textField}
                        label="Suche"
                        placeholder="Land- und Stadtkreise"
                        value={filterValue}
                        onChange={e => setFilterValue(e.target.value.toLowerCase())}
                        helperText={showSkeletons ? undefined : 'Fälle pro 100 000 Einwohner'}
                    />
                    <List dense disablePadding>
                        {counties?.filter(favoriteCounties('include')).map(listItemRenderer)}
                        {!showSkeletons && <Divider className={classes.divider} />}
                        {counties
                            ?.filter(favoriteCounties('skip'))
                            .filter(includesFilterValue)
                            .map(listItemRenderer)}

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
                                    <ListItemSecondaryAction>
                                        <Skeleton width={24} height={24} variant="circle" />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                    </List>
                </Paper>
            </Slide>
        </>
    )
}

export default ChartMostAffected
