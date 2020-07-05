import { ListSubheader, makeStyles } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { Cellphone, Laptop, Responsive } from 'mdi-material-ui'
import React from 'react'

import { useLayoutContext } from '../Provider/LayoutProvider'

const useStyles = makeStyles(() => ({
    buttonGroup: {
        width: '100%',
    },
    button: {
        flexGrow: 1,
    },
}))

const SettingsLayout = () => {
    const { layoutSetting, onLayoutSettingChange } = useLayoutContext()

    const classes = useStyles()

    return (
        <>
            <ListSubheader disableGutters disableSticky>
                Layout: {layoutSetting}
            </ListSubheader>
            <ToggleButtonGroup
                value={layoutSetting}
                exclusive
                onChange={(_, newValue) => onLayoutSettingChange(newValue)}
                className={classes.buttonGroup}>
                <ToggleButton className={classes.button} value="responsive">
                    <Responsive />
                </ToggleButton>
                <ToggleButton className={classes.button} value="desktop">
                    <Laptop />
                </ToggleButton>
                <ToggleButton className={classes.button} value="mobile">
                    <Cellphone />
                </ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}

export default SettingsLayout
