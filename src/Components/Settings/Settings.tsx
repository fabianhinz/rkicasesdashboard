import {
    Button,
    createStyles,
    Divider,
    Fab,
    Grid,
    Link,
    makeStyles,
    Typography,
} from '@material-ui/core'
import { Close, WeatherNight, WeatherSunny } from 'mdi-material-ui'
import React from 'react'

import db from '../../services/db'
import { useLayoutContext } from '../Provider/LayoutProvider'
import { useThemeContext } from '../Provider/ThemeProvider'
import { Drawer, DrawerAction, DrawerContent, DrawerHeader } from '../Shared/Drawer'
import SettingsDashboard from './SettingsDashboard'
import SettingsLayout from './SettingsLayout'
import SettingsStates from './SettingsStates'
import SettingsSummary from './SettingsSummary'

const useStyles = makeStyles(theme =>
    createStyles({
        themeFab: {
            flexShrink: 0,
            boxShadow: theme.shadows[0],
        },
    })
)

interface Props {
    open: boolean
    onClose: () => void
}

const Settings = ({ open, onClose }: Props) => {
    const { theme, setTheme } = useThemeContext()

    const classes = useStyles()

    const { layout } = useLayoutContext()

    const handleThemeFabClick = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark'
            db.data.put(newTheme, 'theme')
            return newTheme
        })
    }

    return (
        <Drawer open={open} onClose={onClose}>
            <DrawerHeader
                title={
                    <>
                        <Typography variant="h6">Fallzahlen in Deutschland</Typography>
                        <Typography color="textSecondary">Version: {__VERSION__}</Typography>
                    </>
                }
                actions={
                    <Fab onClick={handleThemeFabClick} className={classes.themeFab} size="small">
                        {theme === 'light' ? <WeatherNight /> : <WeatherSunny />}
                    </Fab>
                }
            />

            <DrawerContent>
                <Grid container spacing={2} justify="center" direction="column">
                    <Grid item>
                        <SettingsLayout />
                    </Grid>
                    <Grid item>
                        <SettingsSummary />
                    </Grid>
                    <Grid item>
                        <SettingsStates />
                    </Grid>
                    {layout === 'desktop' && (
                        <Grid item>
                            <SettingsDashboard />
                        </Grid>
                    )}
                    <Grid item>
                        <Divider />
                    </Grid>
                    <Grid item>
                        <Link
                            target="_blank"
                            href="https://github.com/fabianhinz/rkicasesdashboard">
                            Quellcode der Anwendung
                        </Link>
                    </Grid>
                </Grid>
            </DrawerContent>

            <DrawerAction>
                <Button fullWidth onClick={onClose} startIcon={<Close />}>
                    schließen
                </Button>
            </DrawerAction>
        </Drawer>
    )
}

export default Settings
