import { makeStyles, Tab, Tabs, Typography } from '@material-ui/core'
import { AccountAlert, AccountMultiple, Sigma, Skull } from 'mdi-material-ui'
import React from 'react'

import { LEGEND } from '../../constants'
import { useConfigContext } from '../Provider/ConfigProvider'

interface StyleProps {
    tabsindicatorColor: string
    showLegend: boolean
}

const useStyles = makeStyles(theme => {
    return {
        textField: {
            width: '100%',
        },
        tabsindicator: {
            backgroundColor: ({ tabsindicatorColor }: StyleProps) => tabsindicatorColor,
        },
        tabSelected: {
            color: ({ tabsindicatorColor }: StyleProps) => tabsindicatorColor,
        },
        tabsroot: {
            minWidth: 'unset',
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
        paginationUl: {
            justifyContent: 'space-between',
        },
    }
})

interface Props {
    tabIndex: number
    onTabIndexChange: (newTab: number) => void
    tabsindicatorColor: string
}

const EsriLkSkTabs = ({ tabIndex, onTabIndexChange, tabsindicatorColor }: Props) => {
    const { config } = useConfigContext()

    const classes = useStyles({
        tabsindicatorColor,
        showLegend: config.settings.showLegend,
    })

    return (
        <div>
            {config.settings.showLegend && (
                <Typography align="center" gutterBottom color="textSecondary" variant="subtitle2">
                    {tabIndex === 0
                        ? LEGEND.cases
                        : tabIndex === 1
                        ? LEGEND.rate
                        : tabIndex === 2
                        ? LEGEND.weeklyRate
                        : LEGEND.deaths}
                </Typography>
            )}
            <Tabs
                classes={{ indicator: classes.tabsindicator, root: classes.tabsroot }}
                value={tabIndex}
                onChange={(_e, index) => onTabIndexChange(index)}>
                <Tab
                    classes={{ selected: classes.tabSelected, root: classes.tabsroot }}
                    icon={<Sigma />}
                />
                <Tab
                    classes={{ selected: classes.tabSelected, root: classes.tabsroot }}
                    icon={<AccountMultiple />}
                />
                <Tab
                    classes={{ selected: classes.tabSelected, root: classes.tabsroot }}
                    icon={<AccountAlert />}
                />
                <Tab
                    classes={{ selected: classes.tabSelected, root: classes.tabsroot }}
                    icon={<Skull />}
                />
            </Tabs>
        </div>
    )
}

export default EsriLkSkTabs
