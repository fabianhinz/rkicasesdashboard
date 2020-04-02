import {
    Button,
    Checkbox,
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
import { Close, Eye, WeatherNight, WeatherSunny } from 'mdi-material-ui'
import React from 'react'

import { Settings as SettingsModel } from '../../model/model'
import db from '../../services/db'
import { useConfigContext } from '../Provider/Configprovider'
import { useDataContext } from '../Provider/Dataprovider'
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
            width: 320,
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

interface Props {
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const Settings = ({ open, onOpenChange }: Props) => {
    const { theme, setTheme } = useThemeContext()
    const { data } = useDataContext()
    const { config, configDispatch } = useConfigContext()

    const classes = useStyles()

    const lowRes = useMediaQuery('(max-width: 768px)')

    const handleChange = (key: Partial<keyof SettingsModel>) => (
        _e: React.ChangeEvent<HTMLInputElement>,
        value: boolean
    ) => {
        const settings = { ...config.settings, [key]: value }
        configDispatch({ type: 'settingsChange', settings })
        db.data.put(settings, 'settings')
    }

    const handleChipClick = (state: string) => () => {
        const enabledStates = new Set(config.enabledStates)
        if (enabledStates.has(state)) enabledStates.delete(state)
        else enabledStates.add(state)

        db.data.put(enabledStates, 'enabledStates')
        configDispatch({ type: 'enabledStatesChange', enabledStates })
    }

    const handleThemeFabClick = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark'
            db.data.put(newTheme, 'theme')
            return newTheme
        })
    }

    const handleSelectAllBtnClick = () => {
        const enabledStates: Set<string> =
            config.enabledStates.size === 16 ? new Set() : new Set(data.byState.keys())
        db.data.put(enabledStates, 'enabledStates')
        configDispatch({
            type: 'enabledStatesChange',
            enabledStates,
        })
    }

    return (
        <>
            <Drawer
                PaperProps={{ className: classes.paper }}
                variant={lowRes ? 'temporary' : 'persistent'}
                anchor="right"
                open={open}
                onClose={() => onOpenChange(false)}>
                <div className={classes.header}>
                    <Typography variant="h6">Fallzahlen in Deutschland</Typography>
                    <Fab onClick={handleThemeFabClick} className={classes.themeFab} size="small">
                        {theme === 'light' ? <WeatherNight /> : <WeatherSunny />}
                    </Fab>
                </div>
                <div className={classes.container}>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <ListSubheader disableSticky disableGutters>
                                Bundesländer
                            </ListSubheader>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        onClick={handleSelectAllBtnClick}
                                        startIcon={
                                            <Checkbox
                                                checked={config.enabledStates.size === 16}
                                                disableRipple
                                            />
                                        }>
                                        alle auswählen
                                    </Button>
                                </Grid>
                                {[...data.byState.keys()].map(state => (
                                    <Grid item key={state}>
                                        <Chip
                                            label={state}
                                            onClick={handleChipClick(state)}
                                            color={
                                                config.enabledStates.has(state)
                                                    ? 'primary'
                                                    : 'default'
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item>
                            <ListSubheader disableSticky disableGutters>
                                Ansicht
                            </ListSubheader>
                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <Switch
                                            edge="start"
                                            checked={config.settings.log}
                                            onChange={handleChange('log')}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary="Log" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <Switch
                                            edge="start"
                                            checked={config.settings.showAxis}
                                            onChange={handleChange('showAxis')}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary="Achsen" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <Switch
                                            edge="start"
                                            checked={config.settings.showLegend}
                                            onChange={handleChange('showLegend')}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary="Legende" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <Switch
                                            edge="start"
                                            checked={config.settings.grid}
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
                    <Button fullWidth onClick={() => onOpenChange(false)} startIcon={<Close />}>
                        schließen
                    </Button>
                </div>
            </Drawer>

            <Fab className={classes.fab} onClick={() => onOpenChange(true)}>
                <Eye />
            </Fab>
        </>
    )
}

export default Settings
