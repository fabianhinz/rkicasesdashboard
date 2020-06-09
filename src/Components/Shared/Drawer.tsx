import { createStyles, Drawer as MuiDrawer, DrawerProps, makeStyles } from '@material-ui/core'
import React, { ReactNode } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        paper: {
            width: 320,
            [theme.breakpoints.up('sm')]: {
                width: 425,
            },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            userSelect: 'none',
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            boxShadow: theme.shadows[4],
            padding: theme.spacing(2),
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
            paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
        },
        header: {
            paddingBottom: theme.spacing(1),
            position: 'relative',
        },
        headerActions: {
            position: 'absolute',
            top: 0,
            right: 0,
        },
        content: {
            willChange: 'transform',
            overflowX: 'hidden',
        },
        actions: {
            paddingTop: theme.spacing(1),
        },
    })
)

interface WithChildren {
    children: React.ReactNode
}

const Drawer = ({
    children,
    onClose,
    ...drawerProps
}: WithChildren & Omit<DrawerProps, 'anchor' | 'PaperProps'>) => {
    const classes = useStyles()

    return (
        <MuiDrawer
            variant="persistent"
            PaperProps={{ className: classes.paper }}
            anchor="right"
            SlideProps={{ mountOnEnter: true, unmountOnExit: true }}
            {...drawerProps}>
            {children}
        </MuiDrawer>
    )
}

const DrawerHeader = (props: { title: ReactNode; actions?: ReactNode }) => {
    const classes = useStyles()

    return (
        <div className={classes.header}>
            {props.title}
            {props.actions && <div className={classes.headerActions}>{props.actions}</div>}
        </div>
    )
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
