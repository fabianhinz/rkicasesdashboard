import {
    Chip,
    createStyles,
    Drawer,
    Fab,
    Grid,
    IconButton,
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
import db from '../../services/db'
import { useThemeContext } from '../Provider/Themeprovider'

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            position: 'fixed',
            bottom: `max(env(safe-area-inset-bottom), ${theme.spacing(3)}px)`,
            right: theme.spacing(3),
        },
        themeFab: {
            boxShadow: theme.shadows[0],
        },
        paper: {
            [theme.breakpoints.between('xs', 'md')]: {
                width: 320,
            },
            [theme.breakpoints.up('lg')]: {
                width: 425,
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            userSelect: 'none',
        },
        header: {
            padding: theme.spacing(2),
            paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        container: {
            flexGrow: 1,
            padding: theme.spacing(2),
            paddingTop: 0,
            maxHeight: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
        },
        action: {
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: theme.spacing(1),
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
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
        const newSettings = { ...settings, [key]: value }
        onSettingsChange(newSettings)

        db.data.put(newSettings, 'settings')
    }

    const closeDialog = () => setOpen(false)

    const handleChipClick = (state: string) => () => {
        onEnabledStatesChange(prev => {
            if (prev.has(state)) prev.delete(state)
            else prev.add(state)

            db.data.put(prev, 'enabledStates')
            return new Set(prev)
        })
    }

    const handleThemeFabClick = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark'
            db.data.put(newTheme, 'theme')
            return newTheme
        })
    }

    return (
        <>
            <Drawer
                PaperProps={{ className: classes.paper }}
                variant={highRes ? 'persistent' : 'temporary'}
                anchor="right"
                open={open}
                onClose={closeDialog}>
                <div className={classes.header}>
                    <Typography variant="h6">Einstellungen</Typography>
                    <Fab onClick={handleThemeFabClick} className={classes.themeFab} size="small">
                        {theme === 'light' ? <WeatherNight /> : <WeatherSunny />}
                    </Fab>
                </div>
                <div className={classes.container}>
                    <Grid container spacing={2} direction="column">
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
                            <ListSubheader disableSticky disableGutters>
                                Diagramm
                            </ListSubheader>
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
                            <ListSubheader disableSticky disableGutters>
                                Sonstiges
                            </ListSubheader>
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
                    </Grid>
                </div>
                <div className={classes.action}>
                    <IconButton onClick={closeDialog}>
                        <Close />
                    </IconButton>
                </div>
            </Drawer>

            <Fab className={classes.fab} onClick={() => setOpen(!open)}>
                <SettingsIcon />
            </Fab>
        </>
    )
}

export default Settings
