import { Button, Chip, Grid, ListSubheader } from '@material-ui/core'
import React from 'react'

import db from '../../services/db'
import { useConfigContext } from '../Provider/Configprovider'
import { useDataContext } from '../Provider/Dataprovider'

const SettingsStates = () => {
    const { data } = useDataContext()
    const { config, configDispatch } = useConfigContext()

    const handleChipClick = (state: string) => () => {
        const enabledStates = new Set(config.enabledStates)
        if (enabledStates.has(state)) enabledStates.delete(state)
        else enabledStates.add(state)

        db.data.put(enabledStates, 'enabledStates')
        configDispatch({ type: 'enabledStatesChange', enabledStates })
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
            <ListSubheader disableSticky disableGutters>
                Bundesländer
            </ListSubheader>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button
                        disableElevation
                        fullWidth
                        onClick={handleSelectAllBtnClick}
                        variant="contained">
                        alle {config.enabledStates.size === 16 ? 'abwählen' : 'auswählen'}
                    </Button>
                </Grid>
                {[...data.byState.keys()].map(state => (
                    <Grid item key={state}>
                        <Chip
                            label={state}
                            onClick={handleChipClick(state)}
                            color={config.enabledStates.has(state) ? 'primary' : 'default'}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default SettingsStates
