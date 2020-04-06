import {
    Button,
    createStyles,
    Drawer,
    Fab,
    Grid,
    makeStyles,
    Typography,
    useMediaQuery,
} from '@material-ui/core'
import { Close, Eye, WeatherNight, WeatherSunny } from 'mdi-material-ui'
import React from 'react'

import db from '../../services/db'
import { useThemeContext } from '../Provider/Themeprovider'
import SettingsDashboard from './SettingsDashboard'
import SettingsStates from './SettingsStates'
import SettingsSummary from './SettingsSummary'

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            position: 'fixed',
            bottom: `max(env(safe-area-inset-bottom), ${theme.spacing(3)}px)`,
            right: theme.spacing(3),
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
                        <Typography color="textSecondary"> Version: {__VERSION__}</Typography>
                    </div>
                    <Fab onClick={handleThemeFabClick} className={classes.themeFab} size="small">
                        {theme === 'light' ? <WeatherNight /> : <WeatherSunny />}
                    </Fab>
                </div>
                <div className={classes.container}>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <SettingsSummary />
                        </Grid>

                        <Grid item>
                            <SettingsStates />
                        </Grid>

                        <Grid item>
                            <SettingsDashboard />
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
