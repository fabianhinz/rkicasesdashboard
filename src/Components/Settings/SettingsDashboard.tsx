import {
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemTextProps,
    ListSubheader,
    Slide,
    Switch,
    SwitchProps,
} from '@material-ui/core'
import React from 'react'

import { Settings } from '../../model/model'
import db from '../../services/db'
import { useConfigContext } from '../Provider/Configprovider'

type DashboardListItemProps = Pick<SwitchProps, 'checked' | 'onChange'> &
    Pick<ListItemTextProps, 'primary'>

const DashboardListItem = ({ checked, onChange, primary }: DashboardListItemProps) => (
    <ListItem disableGutters>
        <ListItemIcon>
            <Switch edge="start" checked={checked} onChange={onChange} />
        </ListItemIcon>
        <ListItemText primary={primary} />
    </ListItem>
)

const SettingsDashboard = () => {
    const { config, configDispatch } = useConfigContext()

    const handleChange = (key: Partial<keyof Settings>) => (
        _e: React.ChangeEvent<HTMLInputElement>,
        value: boolean
    ) => {
        const settings = { ...config.settings, [key]: value }
        configDispatch({ type: 'settingsChange', settings })
        db.data.put(settings, 'settings')
    }

    return (
        <>
            <ListSubheader disableSticky disableGutters>
                Dashboard
            </ListSubheader>
            <List disablePadding>
                <DashboardListItem
                    checked={config.settings.log}
                    onChange={handleChange('log')}
                    primary="Log"
                />
                <DashboardListItem
                    checked={config.settings.showAxis}
                    onChange={handleChange('showAxis')}
                    primary="Achsen"
                />
                <DashboardListItem
                    checked={config.settings.showLegend}
                    onChange={handleChange('showLegend')}
                    primary="Legende"
                />

                <Slide in={config.enabledStates.size > 0} direction="left">
                    <div>
                        <Hidden mdDown>
                            <DashboardListItem
                                checked={config.settings.grid}
                                onChange={handleChange('grid')}
                                primary="Gridansicht"
                            />
                        </Hidden>
                        <DashboardListItem
                            checked={config.settings.syncTooltip}
                            onChange={handleChange('syncTooltip')}
                            primary="Tooltipsync"
                        />
                        <DashboardListItem
                            checked={config.settings.normalize}
                            onChange={handleChange('normalize')}
                            primary="Normalisieren"
                        />
                    </div>
                </Slide>
            </List>
        </>
    )
}

export default SettingsDashboard
