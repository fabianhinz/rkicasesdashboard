import { createStyles, Drawer as MuiDrawer, DrawerProps, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            width: 320,
            [theme.breakpoints.up('sm')]: {
                width: 425,
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            userSelect: 'none',
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            boxShadow: theme.shadows[4],
        },
        header: {
            padding: theme.spacing(2),
            paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        content: {
            flexGrow: 1,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            willChange: 'transform',
            overflowX: 'hidden',
        },
        actions: {
            padding: theme.spacing(1),
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
        },
    })
)

interface WithChildren {
    children: React.ReactNode
}

const Drawer = ({
    children,
    ...drawerProps
}: WithChildren & Omit<DrawerProps, 'anchor' | 'PaperProps'>) => {
    const classes = useStyles()

    return (
        <MuiDrawer
            variant="persistent"
            PaperProps={{ className: classes.paper }}
            anchor="right"
            {...drawerProps}>
            {children}
        </MuiDrawer>
    )
}

const DrawerHeader = (props: WithChildren) => {
    const classes = useStyles()

    return <div className={classes.header}>{props.children}</div>
}

const DrawerContent = (props: WithChildren) => {
    const classes = useStyles()

    return <div className={classes.content}>{props.children}</div>
}

const DrawerAction = (props: WithChildren) => {
    const classes = useStyles()

    return <div className={classes.actions}>{props.children}</div>
}

export { Drawer, DrawerHeader, DrawerContent, DrawerAction }
