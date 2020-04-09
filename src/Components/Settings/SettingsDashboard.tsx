import { Hidden, List, ListSubheader, Slide, Slider, Typography } from '@material-ui/core'
import React, { useState } from 'react'

import { Settings } from '../../model/model'
import db from '../../services/db'
import { useConfigContext } from '../Provider/Configprovider'
import SettingsListItem from './SettingsListItem'

const SettingsDashboard = () => {
    const { config, configDispatch } = useConfigContext()
    const [internalRatio, setInternalRatio] = useState(config.settings.ratio)

    const handleChange = (key: keyof Settings) => (_e: React.ChangeEvent<{}>, value: any) => {
        const settings = { ...config.settings, [key]: value }
        configDispatch({ type: 'settingsChange', settings })
        db.data.put(settings, 'settings')
    }

    return (
        <>
            <ListSubheader disableSticky disableGutters>
                Dashboard
            </ListSubheader>

            <Typography gutterBottom>Verhältnis</Typography>
            <Slider
                value={internalRatio}
                onChange={(_e, ratio) => setInternalRatio(ratio as number)}
                onChangeCommitted={handleChange('ratio')}
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={1}
                max={3}
            />

            <List disablePadding>
                <SettingsListItem
                    checked={config.settings.log}
                    onChange={handleChange('log')}
                    primary="Log"
                    secondary="bi-symmetric log transformation"
                />
                <SettingsListItem
                    checked={config.settings.showAxis}
                    onChange={handleChange('showAxis')}
                    primary="Achsen"
                    secondary="Y-Achsen der Diagramme"
                />

                <Slide
                    mountOnEnter
                    unmountOnExit
                    in={config.enabledStates.size > 0}
                    direction="left">
                    <div>
                        <Hidden mdDown>
                            <SettingsListItem
                                checked={config.settings.grid}
                                onChange={handleChange('grid')}
                                primary="Gridansicht"
                                secondary="Kompakte Ansicht bei hinreichend Platz"
                            />
                        </Hidden>
                        <SettingsListItem
                            checked={config.settings.normalize}
                            onChange={handleChange('normalize')}
                            primary="Normalisieren"
                            secondary="Einheitlicher Maßstab der Achsen"
                        />
                    </div>
                </Slide>
            </List>
        </>
    )
}

export default SettingsDashboard
