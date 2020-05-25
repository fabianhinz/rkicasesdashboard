import {
    Button,
    createStyles,
    Divider,
    Drawer,
    Fab,
    Grid,
    Link,
    makeStyles,
    Typography,
    useMediaQuery,
} from '@material-ui/core'
import { Close, Tune, WeatherNight, WeatherSunny } from 'mdi-material-ui'
import React from 'react'

import db from '../../services/db'
import { useThemeContext } from '../Provider/ThemeProvider'
import SettingsDashboard from './SettingsDashboard'
import SettingsStates from './SettingsStates'
import SettingsSummary from './SettingsSummary'

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            position: 'fixed',
            bottom: `calc(env(safe-area-inset-bottom) + ${theme.spacing(2)}px)`,
            zIndex: theme.zIndex.appBar + 1,
            right: theme.spacing(2),
        },
        themeFab: {
            flexShrink: 0,
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
            padding: theme.spacing(1),
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
        },
        settingsIcon: {
            marginRight: theme.spacing(0.5),
        },
    })
)

interface Props {
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const Settings = ({ open, onOpenChange }: Props) => {
    const { theme, setTheme } = useThemeContext()

    const classes = useStyles()

    const lowRes = useMediaQuery('(max-width: 768px)')

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
                variant={lowRes ? 'temporary' : 'persistent'}
                anchor="right"
                open={open}
                onClose={() => onOpenChange(false)}>
                <div className={classes.header}>
                    <div>
                        <Typography variant="h6">Fallzahlen in Deutschland</Typography>
                        <Typography color="textSecondary">Version: {__VERSION__}</Typography>
                    </div>
                    <Fab onClick={handleThemeFabClick} className={classes.themeFab} size="small">
                        {theme === 'light' ? <WeatherNight /> : <WeatherSunny />}
                    </Fab>
                </div>
                <div className={classes.container}>
                    <Grid container spacing={2} justify="center">
                        <Grid item xs={12}>
                            <SettingsSummary />
                        </Grid>

                        <Grid item xs={12}>
                            <SettingsStates />
                        </Grid>

                        <Grid item xs={12}>
                            <SettingsDashboard />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item>
                            <Link
                                target="_blank"
                                href="https://github.com/fabianhinz/rkicasesdashboard">
                                Quellcode
                            </Link>
                        </Grid>
                    </Grid>
                </div>
                <div className={classes.action}>
                    <Button fullWidth onClick={() => onOpenChange(false)} startIcon={<Close />}>
                        schließen
                    </Button>
                </div>
            </Drawer>

            <Fab variant="extended" className={classes.fab} onClick={() => onOpenChange(true)}>
                <Tune className={classes.settingsIcon} /> Einstellungen
            </Fab>
        </>
    )
}

export default Settings
