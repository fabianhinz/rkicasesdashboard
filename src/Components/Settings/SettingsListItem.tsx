import {
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemTextProps,
    Switch,
    SwitchProps,
} from '@material-ui/core'
import React from 'react'

type Props = Pick<SwitchProps, 'checked' | 'onChange'> &
    Pick<ListItemTextProps, 'primary' | 'secondary'>

const SettingsListItem = ({ checked, onChange, primary, secondary }: Props) => (
    <ListItem disableGutters>
        <ListItemIcon>
            <Switch edge="start" checked={checked} onChange={onChange} />
        </ListItemIcon>
        <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
)

export default SettingsListItem
