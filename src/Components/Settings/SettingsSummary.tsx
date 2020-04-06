import { List, ListSubheader } from '@material-ui/core'
import React from 'react'

import { Settings } from '../../model/model'
import db from '../../services/db'
import { useConfigContext } from '../Provider/Configprovider'
import SettingsListItem from './SettingsListItem'

const SettingsSummary = () => {
    const { config, configDispatch } = useConfigContext()

    const handleChange = (key: keyof Pick<Settings, 'showLegend' | 'percentage'>) => (
        _e: React.ChangeEvent<HTMLInputElement>,
        value: boolean
    ) => {
        const settings = { ...config.settings, [key]: value }

        configDispatch({ type: 'settingsChange', settings })
        db.data.put(settings, 'settings')
    }

    return (
        <>
            <ListSubheader disableGutters disableSticky>
                Zusammenfassung
            </ListSubheader>
            <List disablePadding>
                <SettingsListItem
                    checked={config.settings.percentage}
                    onChange={handleChange('percentage')}
                    primary="Anzeige in Prozent"
                    secondary="Delta zum Vortag"
                />
                <SettingsListItem
                    checked={config.settings.showLegend}
                    onChange={handleChange('showLegend')}
                    primary="Legende"
                    secondary="Beschriftung der Metriken"
                />
            </List>
        </>
    )
}

export default SettingsSummary
