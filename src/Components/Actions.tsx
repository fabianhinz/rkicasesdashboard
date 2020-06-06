import { createStyles, makeStyles, Snackbar } from '@material-ui/core'
import { Alert, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab'
import { HomeGroup, Tune } from 'mdi-material-ui'
import React, { useState } from 'react'

import EsriLkSk from './Esri/EsriLkSk'
import EsriProvider from './Provider/EsriProvider'
import { useFirestoreContext } from './Provider/FirestoreProvider'
import Settings from './Settings/Settings'

const useStyles = makeStyles(theme =>
    createStyles({
        speedDial: {
            position: 'fixed',
            bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(3)}px)`,
            zIndex: theme.zIndex.modal + 1,
            right: theme.spacing(3),
        },
        snackbar: {
            bottom: 0,
        },
        alert: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 6px)',
        },
    })
)

const Actions = () => {
    const [speedDialOpen, setSpeedDialOpen] = useState(false)
    const [esriLkSkOpen, setEsriLkSkOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(true)

    const classes = useStyles()

    const { firestoreData } = useFirestoreContext()

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

            {firestoreData.summary?.lastUpdate && (
                <Snackbar
                    classes={{ anchorOriginBottomCenter: classes.snackbar }}
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackbarOpen(false)}>
                    <Alert
                        classes={{ standardInfo: classes.alert }}
                        severity="info"
                        onClose={() => setSnackbarOpen(false)}>
                        Zuletzt aktualisiert am {firestoreData.summary?.lastUpdate.toLocaleString()}
                    </Alert>
                </Snackbar>
            )}

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
