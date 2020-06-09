import { createStyles, makeStyles } from '@material-ui/core'
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab'
import { HomeGroup, Tune } from 'mdi-material-ui'
import React, { useState } from 'react'

import EsriLkSk from './Esri/EsriLkSk'
import EsriProvider from './Provider/EsriProvider'
import Settings from './Settings/Settings'

const useStyles = makeStyles(theme =>
    createStyles({
        speedDial: {
            position: 'fixed',
            bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(3)}px)`,
            zIndex: theme.zIndex.modal + 1,
            right: theme.spacing(3),
        },
    })
)

const Actions = () => {
    const [speedDialOpen, setSpeedDialOpen] = useState(false)
    const [esriLkSkOpen, setEsriLkSkOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)

    const classes = useStyles()

    const handleSpeedDialActionClick = (target: 'settings' | 'rki') => () => {
        setSpeedDialOpen(false)
        setEsriLkSkOpen(target === 'rki')
        setSettingsOpen(target === 'settings')
    }

    return (
        <>
            <EsriProvider>
                <EsriLkSk open={esriLkSkOpen} onClose={() => setEsriLkSkOpen(false)} />
            </EsriProvider>

            <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />

            <SpeedDial
                className={classes.speedDial}
                ariaLabel="SpeedDial"
                onClose={() => setSpeedDialOpen(false)}
                onOpen={() => setSpeedDialOpen(true)}
                open={speedDialOpen}
                icon={<SpeedDialIcon />}>
                <SpeedDialAction
                    tooltipTitle="Einstellungen"
                    icon={<Tune />}
                    onClick={handleSpeedDialActionClick('settings')}
                />
                <SpeedDialAction
                    tooltipTitle="Lank- & Stadtkreise"
                    icon={<HomeGroup />}
                    onClick={handleSpeedDialActionClick('rki')}
                />
            </SpeedDial>
        </>
    )
}

export default Actions
