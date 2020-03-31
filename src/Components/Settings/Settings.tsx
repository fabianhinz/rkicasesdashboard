import {
    Button,
    Chip,
    createStyles,
    Drawer,
    Fab,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
    Switch,
    Typography,
    useMediaQuery,
} from '@material-ui/core'
import { Close, Settings as SettingsIcon, WeatherNight, WeatherSunny } from 'mdi-material-ui'
import React, { useState } from 'react'

import { Settings as SettingsModel } from '../../model/model'
import { useThemeContext } from '../Provider/Themeprovider'

const useStyles = makeStyles(theme =>
    createStyles({
        title: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        fab: {
            position: 'fixed',
            bottom: `max(env(safe-area-inset-bottom), ${theme.spacing(3)}px)`,
            right: theme.spacing(3),
        },
        themeFab: {
            boxShadow: theme.shadows[0],
        },
        paper: {
            padding: theme.spacing(3),
            [theme.breakpoints.only('xs')]: {
                maxWidth: 320,
            },
            [theme.breakpoints.up('sm')]: {
                maxWidth: 425,
            },
        },
    })
)

interface Props extends SettingsModel {
    states: string[]
    enabledStates: Set<string>
    onEnabledStatesChange: React.Dispatch<React.SetStateAction<Set<string>>>
    onSettingsChange: (model: SettingsModel) => void
}

const Settings = ({
    states,
    enabledStates,
    onEnabledStatesChange,
    onSettingsChange,
    ...settings
}: Props) => {
    // ? max width of Container + 425 paper width
    const highRes = useMediaQuery('(min-width: 2860px)')
    const [open, setOpen] = useState(false)
    const classes = useStyles()

    const { theme, setTheme } = useThemeContext()

    const handleChange = (key: Partial<keyof SettingsModel>) => (
        _e: React.ChangeEvent<HTMLInputElement>,
        value: boolean
    ) => {
        onSettingsChange({ ...settings, [key]: value })
    }

    const closeDialog = () => setOpen(false)

    const handleChipClick = (state: string) => () => {
        onEnabledStatesChange(prev => {
            if (prev.has(state)) prev.delete(state)
            else prev.add(state)

            return new Set(prev)
        })
    }

    const handleThemeFabClick = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <>
            <Drawer
                PaperProps={{ className: classes.paper }}
                variant={highRes ? 'persistent' : 'temporary'}
                anchor="right"
                open={open}
                onClose={closeDialog}>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <div className={classes.title}>
                            <Typography variant="h6">Einstellungen</Typography>
                            <Fab
                                onClick={handleThemeFabClick}
                                className={classes.themeFab}
                                size="small">
                                {theme === 'light' ? <WeatherNight /> : <WeatherSunny />}
                            </Fab>
                        </div>
                    </Grid>

                    <Grid item>
                        <Grid container spacing={2}>
                            {states.map(state => (
                                <Grid item key={state}>
                                    <Chip
                                        label={state}
                                        onClick={handleChipClick(state)}
                                        color={enabledStates.has(state) ? 'primary' : 'default'}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid item>
                        <ListSubheader disableGutters>Diagramm</ListSubheader>
                        <List disablePadding>
                            <ListItem disableGutters>
                                <ListItemIcon>
                                    <Switch
                                        edge="start"
                                        checked={settings.log}
                                        onChange={handleChange('log')}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Log" />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemIcon>
                                    <Switch
                                        edge="start"
                                        checked={settings.showAxis}
                                        onChange={handleChange('showAxis')}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Achsen" />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemIcon>
                                    <Switch
                                        edge="start"
                                        checked={settings.showLegend}
                                        onChange={handleChange('showLegend')}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Legende" />
                            </ListItem>
                        </List>
                        <ListSubheader disableGutters>Sonstiges</ListSubheader>
                        <List disablePadding>
                            <ListItem disableGutters>
                                <ListItemIcon>
                                    <Switch
                                        edge="start"
                                        checked={settings.grid}
                                        onChange={handleChange('grid')}
                                    />
                                </ListItemIcon>
                                <ListItemText primary="Gridansicht" />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item>
                        <Button fullWidth startIcon={<Close />} onClick={closeDialog}>
                            schließen
                        </Button>
                    </Grid>
                </Grid>
            </Drawer>

            <Fab className={classes.fab} onClick={() => setOpen(!open)}>
                <SettingsIcon />
            </Fab>
        </>
    )
}

export default Settings
