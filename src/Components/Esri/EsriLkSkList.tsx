import {
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    TextField,
    Typography,
} from '@material-ui/core'
import { Pagination, Skeleton } from '@material-ui/lab'
import React, { useLayoutEffect, useMemo, useState } from 'react'

import { useConfigContext } from '../Provider/ConfigProvider'
import { useEsriContext } from '../Provider/EsriProvider'
import EsriLkSkListItem from './EsriLkSkListItem'

const ITEMS_PER_PAGE = 20

const useStyles = makeStyles(theme => {
    return {
        textField: {
            width: '100%',
        },
        divider: {
            margin: '8px -16px 8px -16px',
        },
        list: {
            overflowY: 'auto',
            overflowX: 'hidden',
        },
        paginationRoot: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            position: 'sticky',
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: theme.zIndex.appBar,
        },
    }
})

interface Props {
    tabIndex: number
    tabsindicatorColor: string
}

const EsriLkSkList = ({ tabIndex, tabsindicatorColor }: Props) => {
    const [filterValue, setFilterValue] = useState('')
    const [page, setPage] = useState(1)

    const { config } = useConfigContext()
    const { esriData } = useEsriContext()

    const classes = useStyles()

    const { favorites, counties, paginatedCounties } = useMemo(() => {
        const activeKey =
            tabIndex === 0
                ? 'casesByState'
                : tabIndex === 1
                ? 'rateByState'
                : tabIndex === 2
                ? 'weekRateByState'
                : 'deathsByState'

        const tabAwareListData = Array.from(esriData[activeKey].entries())
            .filter(([state]) => config.enabledStates.size === 0 || config.enabledStates.has(state))
            .map(([name, countyData]) => countyData.map(data => ({ ...data, name })))
            .flat()
            .sort((a, b) => b.value - a.value)

        const counties = tabAwareListData.filter(
            data =>
                !config.favoriteCounties.has(data.county) &&
                data.county.toLowerCase().includes(filterValue)
        )

        return {
            favorites: tabAwareListData.filter(
                data =>
                    config.favoriteCounties.has(data.county) &&
                    data.county.toLowerCase().includes(filterValue)
            ),
            counties,
            paginatedCounties: counties.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
        }
    }, [config.enabledStates, config.favoriteCounties, esriData, filterValue, page, tabIndex])

    useLayoutEffect(() => {
        if (page > 1 && paginatedCounties.length === 0) setPage(1)
    }, [page, paginatedCounties.length])

    return (
        <>
            <Pagination
                className={classes.paginationRoot}
                shape="rounded"
                variant="outlined"
                page={page}
                count={Math.ceil(counties.length / ITEMS_PER_PAGE)}
                onChange={(_, newPage) => setPage(newPage)}
            />

            <Typography gutterBottom component="div" align="center" variant="caption" color="error">
                {esriData.errorMsg}
            </Typography>

            <TextField
                className={classes.textField}
                label="Suche"
                placeholder="Land- und Stadtkreise"
                value={filterValue}
                onChange={e => setFilterValue(e.target.value.toLowerCase())}
            />

            <List dense className={classes.list}>
                {favorites.map(data => (
                    <EsriLkSkListItem
                        data={data}
                        key={data.county}
                        avatarColor={tabsindicatorColor}
                    />
                ))}

                {paginatedCounties.map(data => (
                    <EsriLkSkListItem
                        data={data}
                        key={data.county}
                        avatarColor={tabsindicatorColor}
                    />
                ))}

                {esriData.loading &&
                    new Array(30).fill(1).map((_dummy, index) => (
                        <ListItem disableGutters key={index}>
                            <ListItemIcon>
                                <Skeleton width={40} height={40} variant="circle" />
                            </ListItemIcon>
                            <ListItemText
                                primary={<Skeleton variant="text" width="80%" />}
                                secondary={<Skeleton variant="text" width="30%" />}
                            />
                            <ListItemSecondaryAction>
                                <Skeleton width={24} height={24} variant="circle" />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
            </List>
        </>
    )
}

export default EsriLkSkList
