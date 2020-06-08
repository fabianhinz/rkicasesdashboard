import {
    Avatar,
    Button,
    Checkbox,
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@material-ui/core'
import { amber, cyan, red } from '@material-ui/core/colors'
import { Skeleton } from '@material-ui/lab'
import {
    AccountAlert,
    AccountMultiple,
    Close,
    Heart,
    HeartOutline,
    Sigma,
    Skull,
} from 'mdi-material-ui'
import React, { useCallback, useMemo, useState } from 'react'

import { LEGEND } from '../../constants'
import { County } from '../../model/model'
import db from '../../services/db'
import { useConfigContext } from '../Provider/ConfigProvider'
import { useEsriContext } from '../Provider/EsriProvider'
import { Drawer, DrawerAction, DrawerContent, DrawerHeader } from '../Shared/Drawer'

type DisplayMode = 'standalone' | 'chart'

interface StyleProps {
    tabsindicatorColor: string
    showLegend: boolean
}

const useStyles = makeStyles(theme => {
    return createStyles({
        textField: {
            width: '100%',
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
})

type CountyWithName = County & { name?: string }

interface Props {
    open: boolean
    onClose: () => void
}

const EsriLkSk = ({ open, onClose }: Props) => {
    const [tabIndex, setTabIndex] = useState(0)
    const [filterValue, setFilterValue] = useState('')

    const { config, configDispatch } = useConfigContext()
    const { esriData } = useEsriContext()

    const tabAwareEsriData = useMemo(() => {
        const activeKey =
            tabIndex === 0
                ? 'casesByState'
                : tabIndex === 1
                ? 'rateByState'
                : tabIndex === 2
                ? 'weekRateByState'
                : 'deathsByState'

        return Array.from(esriData[activeKey].entries())
            .filter(([state]) => config.enabledStates.size === 0 || config.enabledStates.has(state))
            .map(([name, countyData]) => countyData.map(data => ({ ...data, name })))
            .flat()
            .sort((a, b) => b.value - a.value)
    }, [config.enabledStates, esriData, tabIndex])

    const classes = useStyles({
        tabsindicatorColor:
            tabIndex === 0 ? amber.A400 : tabIndex === 1 || tabIndex === 2 ? cyan.A400 : red.A400,
        showLegend: config.settings.showLegend,
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
                        primary={`${
                            data.county.startsWith('LK') || data.county.startsWith('SK')
                                ? data.county.slice(3)
                                : data.county
                        }: ${data.value}`}
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

    const getHelperText = () => {
        if (!config.settings.showLegend) return

        let helperText =
            tabIndex === 0
                ? LEGEND.cases
                : tabIndex === 1
                ? LEGEND.rate
                : tabIndex === 2
                ? LEGEND.weeklyRate
                : LEGEND.deaths

        return helperText
    }

    return (
        <Drawer open={open} onClose={onClose}>
            <DrawerHeader
                title={
                    <TextField
                        className={classes.textField}
                        label="Suche"
                        placeholder="Land- und Stadtkreise"
                        value={filterValue}
                        onChange={e => setFilterValue(e.target.value.toLowerCase())}
                        helperText={getHelperText()}
                    />
                }
            />

            <DrawerContent>
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
                        icon={<AccountAlert />}
                    />
                    <Tab
                        classes={{ selected: classes.tabSelected, root: classes.tabsroot }}
                        icon={<Skull />}
                    />
                </Tabs>

                <Typography component="div" align="center" variant="caption" color="error">
                    {esriData.errorMsg}
                </Typography>

                <List dense className={classes.list}>
                    {tabAwareEsriData
                        ?.filter(favoriteCounties('include'))
                        .filter(includesFilterValue)
                        .map(listItemRenderer('favorite'))}

                    {tabAwareEsriData
                        ?.filter(favoriteCounties('skip'))
                        .filter(includesFilterValue)
                        .map(listItemRenderer('all'))}

                    {esriData.loading &&
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
            </DrawerContent>

            <DrawerAction>
                <Button fullWidth onClick={onClose} startIcon={<Close />}>
                    schließen
                </Button>
            </DrawerAction>
        </Drawer>
    )
}

export default EsriLkSk
