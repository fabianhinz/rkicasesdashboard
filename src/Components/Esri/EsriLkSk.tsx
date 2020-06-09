import {
    Button,
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
import { AccountAlert, AccountMultiple, Close, Sigma, Skull } from 'mdi-material-ui'
import React, { useMemo, useState } from 'react'

import { LEGEND } from '../../constants'
import { County } from '../../model/model'
import { useConfigContext } from '../Provider/ConfigProvider'
import { useEsriContext } from '../Provider/EsriProvider'
import { Drawer, DrawerAction, DrawerContent, DrawerHeader } from '../Shared/Drawer'
import EsriLkSkListItem from './EsriLkSkListItem'

interface StyleProps {
    tabsindicatorColor: string
    showLegend: boolean
}

const useStyles = makeStyles(() => {
    return createStyles({
        textField: {
            width: '100%',
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
        divider: {
            margin: '8px -16px 8px -16px',
        },
        list: {
            overflowY: 'auto',
            overflowX: 'hidden',
        },
    })
})

export type CountyWithName = County & { name?: string }

interface Props {
    open: boolean
    onClose: () => void
}

const EsriLkSk = ({ open, onClose }: Props) => {
    const [tabIndex, setTabIndex] = useState(0)
    const [filterValue, setFilterValue] = useState('')

    const { config } = useConfigContext()
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

    const tabsindicatorColor = useMemo(
        () =>
            tabIndex === 0 ? amber.A400 : tabIndex === 1 || tabIndex === 2 ? cyan.A400 : red.A400,
        [tabIndex]
    )
    const classes = useStyles({
        tabsindicatorColor,
        showLegend: config.settings.showLegend,
    })

    return (
        <Drawer open={open} onClose={onClose}>
            <DrawerHeader
                title={
                    <div>
                        {config.settings.showLegend && (
                            <Typography
                                align="center"
                                gutterBottom
                                color="textSecondary"
                                variant="subtitle2">
                                {tabIndex === 0
                                    ? LEGEND.cases
                                    : tabIndex === 1
                                    ? LEGEND.rate
                                    : tabIndex === 2
                                    ? LEGEND.weeklyRate
                                    : LEGEND.deaths}
                            </Typography>
                        )}
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
                    </div>
                }
            />

            <DrawerContent>
                <Typography
                    gutterBottom
                    component="div"
                    align="center"
                    variant="caption"
                    color="error">
                    {esriData.errorMsg}
                </Typography>

                <TextField
                    className={classes.textField}
                    label="Suche"
                    placeholder="Land- und Stadtkreise"
                    value={filterValue}
                    onChange={e => setFilterValue(e.target.value.toLowerCase())}
                />

                <List dense className={classes.list}>
                    {tabAwareEsriData
                        ?.filter(
                            data =>
                                config.favoriteCounties.has(data.county) &&
                                data.county.toLowerCase().includes(filterValue)
                        )
                        .map(data => (
                            <EsriLkSkListItem
                                data={data}
                                key={data.county}
                                favoriteCounties={config.favoriteCounties}
                                avatarColor={tabsindicatorColor}
                            />
                        ))}

                    {config.favoriteCounties.size > 0 && <Divider className={classes.divider} />}

                    {tabAwareEsriData
                        ?.filter(
                            data =>
                                !config.favoriteCounties.has(data.county) &&
                                data.county.toLowerCase().includes(filterValue)
                        )
                        .map(data => (
                            <EsriLkSkListItem
                                data={data}
                                key={data.county}
                                favoriteCounties={config.favoriteCounties}
                                avatarColor={tabsindicatorColor}
                            />
                        ))}

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
