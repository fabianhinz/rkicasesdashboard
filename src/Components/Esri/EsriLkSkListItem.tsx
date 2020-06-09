import {
    Avatar,
    Checkbox,
    createStyles,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
} from '@material-ui/core'
import { Heart, HeartOutline } from 'mdi-material-ui'
import React, { useCallback } from 'react'

import db from '../../services/db'
import { useConfigContext } from '../Provider/ConfigProvider'
import { CountyWithName } from './EsriLkSk'

type StyleProps = Pick<Props, 'avatarColor'>

const useStyles = makeStyles(theme =>
    createStyles({
        avatar: {
            transition: theme.transitions.create('all', {
                easing: theme.transitions.easing.easeOut,
            }),
            backgroundColor: ({ avatarColor }: StyleProps) => avatarColor,
            color: ({ avatarColor }: StyleProps) => theme.palette.getContrastText(avatarColor),
        },
    })
)

interface Props {
    data: CountyWithName
    avatarColor: string
    favoriteCounties: Set<string>
}

const EsriLkSkListItem = ({ data, avatarColor }: Props) => {
    const classes = useStyles({ avatarColor })
    const { config, configDispatch } = useConfigContext()

    const handleFavoriteCountiesChange = useCallback(
        (county: string) => () => {
            const { favoriteCounties } = config
            if (favoriteCounties.has(county)) favoriteCounties.delete(county)
            else favoriteCounties.add(county)

            db.data.put(favoriteCounties, 'favoriteCounties')
            configDispatch({ type: 'favoriteCountiesChange', favoriteCounties })
        },
        [config, configDispatch]
    )

    return (
        <ListItem disableGutters>
            <ListItemIcon>
                <Avatar className={classes.avatar}>{data.county.slice(0, 2)}</Avatar>
            </ListItemIcon>
            <ListItemText
                primary={`${
                    data.county.startsWith('LK') || data.county.startsWith('SK')
                        ? data.county.slice(3)
                        : data.county
                }: ${data.value}`}
                secondary={data.name}
            />
            <ListItemSecondaryAction>
                <Checkbox
                    checked={config.favoriteCounties.has(data.county)}
                    onChange={handleFavoriteCountiesChange(data.county)}
                    color="primary"
                    icon={<HeartOutline />}
                    checkedIcon={<Heart />}
                />
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default EsriLkSkListItem
