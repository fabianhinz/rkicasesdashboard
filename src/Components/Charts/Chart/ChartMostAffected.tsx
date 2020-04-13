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
    Tab,
    Tabs,
    TextField,
} from '@material-ui/core'
import { amber, cyan, red } from '@material-ui/core/colors'
import { Skeleton } from '@material-ui/lab'
import { AccountMultiple, Heart, HeartOutline, Sigma, Skull } from 'mdi-material-ui'
import React, { useCallback, useMemo, useState } from 'react'

import { LEGEND } from '../../../constants'
import { County } from '../../../model/model'
import db from '../../../services/db'
import { useConfigContext } from '../../Provider/ConfigProvider'
import { useEsriContext } from '../../Provider/EsriProvider'

interface StyleProps {
    tabsindicatorColor: string
}

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
            zIndex: 1,
            padding: theme.spacing(2),
            paddingBottom: 0,
            willChange: 'transform',
            width: 280,
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.only('sm')]: {
                width: 320,
            },
            [theme.breakpoints.up('md')]: {
                width: 375,
            },
        },
        textField: {
            width: '100%',
            marginBottom: theme.spacing(1),
            minHeight: 70,
        },
        avatar: {
            transition: theme.transitions.create('all', {
                easing: theme.transitions.easing.easeOut,
            }),
            backgroundColor: ({ tabsindicatorColor }: StyleProps) => tabsindicatorColor,
            color: ({ tabsindicatorColor }: StyleProps) =>
                theme.palette.getContrastText(tabsindicatorColor),
        },
        divider: {
            margin: '8px -16px 8px -16px',
        },
        tabsindicator: {
            backgroundColor: ({ tabsindicatorColor }: StyleProps) => tabsindicatorColor,
        },
        tabSelected: {
            color: ({ tabsindicatorColor }: StyleProps) => tabsindicatorColor,
        },
        tabsroot: {
            minWidth: 'unset',
        },
        list: {
            overflowY: 'auto',
            overflowX: 'hidden',
        },
    })
)

type CountyWithName = County & { name?: string }

interface Props {
    open: boolean
    county?: string
    showSkeletons: boolean
}

const ChartMostAffected = ({ county, open, showSkeletons }: Props) => {
    const [tabIndex, setTabIndex] = useState(0)
    const [filterValue, setFilterValue] = useState('')

    const { config, configDispatch } = useConfigContext()
    const { esriData } = useEsriContext()

    const tabAwareEsriData = useMemo(() => {
        const activeKey =
            tabIndex === 0 ? 'casesByState' : tabIndex === 1 ? 'rateByState' : 'deathsByState'

        return county
            ? esriData[activeKey].get(county)
            : Array.from(esriData[activeKey].entries())
                  .map(([name, countyData]) => countyData.map(data => ({ ...data, name })))
                  .flat()
                  .sort((a, b) => b.value - a.value)
    }, [county, esriData, tabIndex])

    const classes = useStyles({
        tabsindicatorColor: tabIndex === 0 ? amber.A400 : tabIndex === 1 ? cyan.A400 : red.A400,
    })

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
        (variant: 'favorite' | 'all') => (data: CountyWithName, index: number, arr: County[]) => (
            <div key={index}>
                <ListItem disableGutters>
                    <ListItemIcon>
                        <Avatar className={classes.avatar}>{data.county.slice(0, 2)}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary={`${data.county.slice(3)}: ${data.value}`}
                        secondary={data.name}
                    />
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
                {variant === 'favorite' && index === arr.length - 1 && (
                    <Divider className={classes.divider} />
                )}
            </div>
        ),
        [classes.avatar, classes.divider, config.favoriteCounties, handleFavoriteCountiesChange]
    )

    const includesFilterValue = (data: CountyWithName) =>
        data.county.toLowerCase().includes(filterValue)

    const favoriteCounties = (strategy: 'include' | 'skip') => (data: CountyWithName) =>
        strategy === 'include'
            ? config.favoriteCounties.has(data.county)
            : !config.favoriteCounties.has(data.county)

    const helperText = () => {
        if (!config.settings.showLegend) return

        let helperText =
            tabIndex === 0 ? LEGEND.cases : tabIndex === 1 ? LEGEND.rate : LEGEND.deaths
        if (tabAwareEsriData) helperText += ` ${tabAwareEsriData[0].lastUpdate}`

        return helperText
    }

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
                        helperText={helperText()}
                    />

                    <Tabs
                        classes={{ indicator: classes.tabsindicator, root: classes.tabsroot }}
                        value={tabIndex}
                        onChange={(_e, index) => setTabIndex(index)}>
                        <Tab
                            classes={{ selected: classes.tabSelected, root: classes.tabsroot }}
                            icon={<Sigma />}
                        />
                        <Tab
                            classes={{ selected: classes.tabSelected, root: classes.tabsroot }}
                            icon={<AccountMultiple />}
                        />
                        <Tab
                            classes={{ selected: classes.tabSelected, root: classes.tabsroot }}
                            icon={<Skull />}
                        />
                    </Tabs>

                    <List dense className={classes.list}>
                        {tabAwareEsriData
                            ?.filter(favoriteCounties('include'))
                            .filter(includesFilterValue)
                            .map(listItemRenderer('favorite'))}

                        {tabAwareEsriData
                            ?.filter(favoriteCounties('skip'))
                            .filter(includesFilterValue)
                            .map(listItemRenderer('all'))}

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
