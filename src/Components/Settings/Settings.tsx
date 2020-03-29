import {
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
    Switch,
} from '@material-ui/core'
import { Close, Settings as SettingsIcon } from 'mdi-material-ui'
import React, { useState } from 'react'

import { Settings as SettingsModel } from '../../model/model'
import { SlideUp } from '../Shared/Transitions'

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            position: 'fixed',
            bottom: `max(env(safe-area-inset-bottom), ${theme.spacing(3)}px)`,
            right: theme.spacing(3),
        },
    })
)

interface Props extends SettingsModel {
    onChange: (model: SettingsModel) => void
}

const Settings = ({ log, showAxis, showLegend, onChange }: Props) => {
    const [open, setOpen] = useState(false)
    const classes = useStyles()

    const handleChange = (key: Partial<keyof SettingsModel>) => (
        _e: React.ChangeEvent<HTMLInputElement>,
        value: boolean
    ) => {
        onChange({ log, showAxis, showLegend, [key]: value })
    }

    const closeDialog = () => setOpen(false)

    return (
        <>
            <Dialog
                TransitionComponent={SlideUp}
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={closeDialog}>
                <DialogTitle>Einstellungen</DialogTitle>
                <DialogContent>
                    <ListSubheader disableGutters>Diagramm</ListSubheader>
                    <List disablePadding>
                        <ListItem disableGutters>
                            <ListItemIcon>
                                <Switch edge="start" checked={log} onChange={handleChange('log')} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Log"
                                secondary={`"bi-symmetric logarithmic scale" ${
                                    log ? 'deaktivieren' : 'aktivieren'
                                }`}
                            />
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemIcon>
                                <Switch
                                    edge="start"
                                    checked={showAxis}
                                    onChange={handleChange('showAxis')}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="Achsen"
                                secondary={`Achsen ${showAxis ? 'ausblenden' : 'anzeigen'}`}
                            />
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemIcon>
                                <Switch
                                    edge="start"
                                    checked={showLegend}
                                    onChange={handleChange('showLegend')}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary="Legend"
                                secondary={`Beschriftung zu den Diagrammen ${
                                    showLegend ? 'ausblenden' : 'anzeigen'
                                }`}
                            />
                        </ListItem>
                    </List>
                    {/* <ListSubheader disableGutters>Sonstiges</ListSubheader>
                    <List disablePadding>
                        <ListItem disableGutters>
                            <ListItemIcon>
                                <Switch edge="start" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Einstellungen speichern"
                                secondary="Beim nächsten Besuch der Anwendung gesetzte Einstellungen laden"
                            />
                        </ListItem>
                    </List> */}
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={closeDialog}>
                        <Close />
                    </IconButton>
                </DialogActions>
            </Dialog>
            <Fab className={classes.fab} onClick={() => setOpen(!open)}>
                <SettingsIcon />
            </Fab>
        </>
    )
}

export default Settings
